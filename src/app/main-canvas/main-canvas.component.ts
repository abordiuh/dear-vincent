import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  HostListener,
  AfterContentInit,
  } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { evaluate } from 'mathjs';
import { CanvasParameters } from '../models/canvas-parameters.model';

@Component({
  selector: 'app-main-canvas',
  templateUrl: './main-canvas.component.html',
  styleUrls: ['./main-canvas.component.scss'],
})
export class MainCanvasComponent implements OnInit, AfterContentInit {
  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;

  @ViewChild('sidepanel', { static: true })
  sidePanel: ElementRef<HTMLDivElement>;

  private cnvs: CanvasRenderingContext2D;
  public cparams: CanvasParameters;
  public errors: {field: string};
  private drawInterval;
  public popUpOpen = false;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.canvas.nativeElement.width = window.innerWidth;
    this.canvas.nativeElement.height = window.innerHeight;
    this.canvas.nativeElement.style.background = 'black';
    this.cnvs = this.canvas.nativeElement.getContext('2d');
    this.cparams = new CanvasParameters();
    this.cparams.showLine = true;

    this.route.queryParams.subscribe(params => {
      this.cparams.equationX = params.equationX;
      this.cparams.equationY = params.equationY;
      this.cparams.minX = parseFloat(params.minX);
      this.cparams.maxX = parseFloat(params.maxX);
      this.cparams.minY = parseFloat(params.minY);
      this.cparams.maxY = parseFloat(params.maxY);
      this.cparams.ittStep = parseFloat(params.ittStep);
      this.cparams.showLine = params.showLine === 'true' ? true : false;
      this.cparams.showPoints = params.showPoints === 'true' ? true : false;
      this.cparams.animSpeed = params.animSpeed;
      this.cparams.color1 = params.color1;
      this.cparams.color2 = params.color2;
      this.cparams.coordinates = params.coordinates;
    });
    this.sidePanel.nativeElement.style.width = '300px';
  }

  ngAfterContentInit(): void {
     this.startDrawing();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event): void {
    this.canvas.nativeElement.width = window.innerWidth;
    this.canvas.nativeElement.height = window.innerHeight;
  }

  mapValue(
    value: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ): number {
    return ((value - x1) * (y2 - x2)) / (y1 - x1) + x2;
  }

  RGBAToHexA(r: number, g: number, b: number, a: number): string {
    let rf = Math.round(r).toString(16);
    let gf = Math.round(g).toString(16);
    let bf = Math.round(b).toString(16);
    let af = Math.round(a * 255).toString(16);

    if (rf.length === 1) {
      rf = '0' + rf;
    }
    if (gf.length === 1) {
      gf = '0' + gf;
    }
    if (bf.length === 1) {
      bf = '0' + bf;
    }
    if (af.length === 1) {
      af = '0' + af;
    }
    return '#' + rf + gf + bf + 'FF';
  }

  HexToRgbNew(hexValue): any {
    const hexToRgb =
    hexValue.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
               ,(m, r, g, b) => '#' + r + r + g + g + b + b)
      .substring(1).match(/.{2}/g)
      .map(x => parseInt(x, 16));
    return hexToRgb;
  }

  startDrawing(): void {
    clearInterval(this.drawInterval);
    this.errors = this.cparams.GetValidationMessage();
    if (this.errors){
      return;
    }

    this.cnvs.clearRect(0, 0, window.innerWidth, window.innerHeight);
    const canvas = this.cnvs.canvas;

    let xi = this.cparams.minX;
    let yi = this.cparams.minY;

    const itterateMax = Math.max(
      Math.abs(this.cparams.maxX - this.cparams.minX),
      Math.abs(this.cparams.maxY - this.cparams.minY)
    );
    let xiStep = (this.cparams.ittStep * Math.abs(this.cparams.maxX - this.cparams.minX)) / itterateMax;
    let yiStep = (this.cparams.ittStep * Math.abs(this.cparams.maxY - this.cparams.minY)) / itterateMax;

    const scopeInitial = { x: this.cparams.minX, y: this.cparams.minY };
    const resXInitial = evaluate(this.cparams.equationX, scopeInitial);
    const resYInitial = evaluate(this.cparams.equationY, scopeInitial);
    const xp = [0, 0];
    if (this.cparams.coordinates.toLowerCase() === 'p'){
      xp[0] = resXInitial * Math.cos(resYInitial);
      xp[1] = resXInitial * Math.sin(resYInitial);
    } else {
      xp[0] = resXInitial;
      xp[1] = resYInitial;
    }

    let rgb = '#FFFFFF';

    this.cnvs.clearRect(0, 0, canvas.width, canvas.height);

    this.drawInterval = setInterval(() => {
      this.errors = this.cparams.GetValidationMessage();
      if (this.errors){
        clearInterval(this.drawInterval);
        return;
      }

      const scope = { x: xi, y: yi, r: xi, Q: yi };
      const resX = evaluate(this.cparams.equationX, scope);
      const resY = evaluate(this.cparams.equationY, scope);

      // Color
      const col1Rgb = this.HexToRgbNew(this.cparams.color1);
      const col2Rgb = this.HexToRgbNew(this.cparams.color2);

      rgb = this.RGBAToHexA(
        this.mapValue(xi, 0, itterateMax, col1Rgb[0], col2Rgb[0]),
        this.mapValue(xi, 0, itterateMax, col1Rgb[1], col2Rgb[1]),
        this.mapValue(xi, 0, itterateMax, col1Rgb[2], col2Rgb[2]),
        100
      );

      this.cnvs.strokeStyle = rgb;
      this.cnvs.fillStyle = rgb;
      if (this.cparams.showPoints) {
        this.cnvs.fillRect(
          window.innerWidth / 2 + xp[0],
          window.innerHeight / 2 - xp[1],
          5,
          5
        );
      }
      // Line
      if (this.cparams.showLine) {
        this.cnvs.beginPath();
        this.cnvs.moveTo(
          window.innerWidth / 2 + xp[0],
          window.innerHeight / 2 - xp[1]
        );
      }

      // Coordinates
      if(this.cparams.coordinates.toLowerCase() === 'p'){
        xp[0] = resX * Math.cos(resY);
        xp[1] = resX * Math.sin(resY);
      } else {
        xp[0] = resX;
        xp[1] = resY;
      }

      if (this.cparams.showLine) {
        this.cnvs.lineTo(
          window.innerWidth / 2 + xp[0],
          window.innerHeight / 2 - xp[1]
        );
        this.cnvs.stroke();
      }
      xi += xiStep;
      yi += yiStep;
      if (xi >= this.cparams.maxX || yi >= this.cparams.maxY) {
        clearInterval(this.drawInterval);
      }
    }, this.mapValue(this.cparams.animSpeed, 1, 100, 0.00001, 20) );
  }

  toggleSidePanel(): void {
    console.log(this.sidePanel.nativeElement.style.width);
    this.sidePanel.nativeElement.style.width =
      this.sidePanel.nativeElement.style.width === '300px' ? '0' : '300px';
  }

  updateQueryParameters(): void {
    this.router.navigate(['/draw'], { queryParams: {
      equationX: this.cparams.equationX,
      equationY: this.cparams.equationY,
      minX: this.cparams.minX,
      maxX: this.cparams.maxX,
      minY: this.cparams.minY,
      maxY: this.cparams.maxY,
      ittStep: this.cparams.ittStep,
      showLine: this.cparams.showLine,
      showPoints: this.cparams.showPoints,
      animSpeed: this.cparams.animSpeed,
      color1: this.cparams.color1,
      color2: this.cparams.color2,
      coordinates: this.cparams.coordinates,
    } });
  }

  onDrawClick(): void {
    this.updateQueryParameters();
    this.startDrawing();
  }

  onExamplesClick(): void {
    this.popUpOpen = true;
  }

  onExamplesCloseClick(): void {
    this.popUpOpen = false;
  }

  onExamplesHeartClick(): void {
    this.popUpOpen = false;
    this.router.navigate(['/draw'], { queryParams: {
      equationX: '160*sin(x rad)^3',
      equationY: '130cos(x rad)-50cos(2*x rad)-20*cos(3*x rad)-cos(4*x rad)',
      minX: 0,
      maxX: 6.28,
      minY: 0,
      maxY: 6.28,
      ittStep: 0.01,
      showLine: true,
      showPoints: false,
      animSpeed: 40,
      color1: '#ff3d3d',
      color2: '#e49a9a',
      coordinates: 'c',
    } }).then(() => { this.startDrawing(); } );

  }

  onExamplesFlowerClick(): void {
    this.popUpOpen = false;
    this.router.navigate(['/draw'], { queryParams: {
      equationX: 'cos(-2*x rad)*200',
      equationY: 'y',
      minX: 0,
      maxX: 6.28,
      minY: 0,
      maxY: 6.28,
      ittStep: 0.01,
      showLine: true,
      showPoints: false,
      animSpeed: 40,
      color1: '#f410a0',
      color2: '#0be099',
      coordinates: 'p',
    } }).then(() => { this.startDrawing(); } );
  }

}
