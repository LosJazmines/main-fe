import { NgModule } from '@angular/core';
import { OrderStatusPipe } from './order-status.pipe';

const ALL_STORE_PIPE = [OrderStatusPipe];

@NgModule({
  declarations: [ALL_STORE_PIPE],
  exports: [ALL_STORE_PIPE],
})
export class PipesModule {}
