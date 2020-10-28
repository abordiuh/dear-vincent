import { NumberValueAccessor } from '@angular/forms';
import { evaluate, compile, parse } from 'mathjs';

export class CanvasParameters {
  public equationX: string;
  public equationY: string;
  public minX: number;
  public maxX: number;
  public ittStep: number;
  public minY: number;
  public maxY: number;
  public animSpeed: number;
  public color1: string;
  public color2: string;
  public showLine: boolean; // checkbox
  public showPoints: boolean; // checkbox
  public coordinates: string;

  GetValidationMessage(): any {
    try {
      const res = evaluate(this.equationX, { x: 1, y: 1 });
    } catch (error) {
      console.error('Log error:', error);
      return { error: 'Wrong equation X. ' + error, field: 'equationX' };
    }

    try {
      const res = evaluate(this.equationY, { x: 1, y: 1 });
    } catch (error) {
      console.error('Log error:', error);
      return { error: 'Wrong equation Y. ' + error, field: 'equationY' };
    }

    if (isNaN(this.minX) || isNaN(this.maxX)) {
      return { error: 'X: Specify Min and Max', field: 'minX' };
    }

    if (isNaN(this.minY) || isNaN(this.maxY)) {
      return { error: 'Y: Specify Min and Max', field: 'minY' };
    }

    if (this.minX > this.maxX) {
      return { error: 'X: Min value should be less than Max', field: 'minX' };
    }

    if (this.minY > this.maxY) {
      return { error: 'Y: Min value should be less than Max', field: 'minY' };
    }

    if (isNaN(this.ittStep) || this.ittStep <= 0) {
      return { error: 'Wrong value of Step', field: 'ittStep' };
    }

    return null;
  }
}
