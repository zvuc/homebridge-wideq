import { AirPurifierDevice, AirPurifierStatus, DeviceInfo } from 'wideq';
import { WideQ } from '../index';
import { AccessoryParser } from './accessory';

export class AirPurifierParser extends AccessoryParser {
  constructor(
    public platform: WideQ,
    public accessoryType: string,
  ) {
    super(platform, accessoryType);
  }

  public getAccessoryCategory(device: DeviceInfo): any {
    return this.platform.Accessory.Categories.AIR_CONDITIONER;
  }

  public updateAccessoryStatuses(device: AirPurifierDevice, accessory: any, status?: AirPurifierStatus) {
    const Characteristic = this.platform.Characteristic;

    this.createOrUpdateService(
      accessory,
      'AirPurifier',
      this.platform.Service.AirPurifier,
      [{
        characteristic: Characteristic.Active,
        getter: () => status?.isOn,
        setter: (value: any) => device.setOn(value)
      }, {
        characteristic: Characteristic.CurrentAirPurifierState,
        getter:  () => status?.mode
      }, {
        characteristic: Characteristic.TargetAirPurifierState,
        setter: (value: any) => device.setMode(value)
      // }, {
      //   characteristic: Characteristic.RotationSpeed,
      //   getter:  () => status?.fanSpeed,
      //   setter: value => device.setFanSpeed(value),
      //   options: { minValue: 1, maxValue: 8 }
      }],
    );

    this.createOrUpdateService(
      accessory,
      'AirQualitySensor',
      this.platform.Service.AirQualitySensor,
      [{
        characteristic: Characteristic.AirQuality,
        getter:  () => status?.totalAirPollution
      }, {
        characteristic: Characteristic.PM10Density,
        getter:  () => status?.sensorPM10,
        options: { minValue: 0, maxValue: 1000 }
      }, {
        characteristic: Characteristic.PM2_5Density,
        getter:  () => status?.sensorPM2,
        options: { minValue: 0, maxValue: 1000 }
      }],
    );
  }
}
