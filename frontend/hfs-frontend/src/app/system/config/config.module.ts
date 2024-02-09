import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigRoutingModule } from './config-routing.module';
import { ConfigComponent } from './config.component';
import { AppConfigModule } from 'src/app/layout/config/config.module';

@NgModule({
    imports: [
        CommonModule,
        ConfigRoutingModule,
        AppConfigModule
    ],
    declarations: [ConfigComponent]
})
export class ConfigModule { }
