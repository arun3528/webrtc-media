import {Device, DeviceKinds, DeviceInterface} from './Device';
import {Track, TrackInterface} from './Track';

/* eslint no-underscore-dangle: 0 */
const _streams : WeakMap<MediaStream, string> = new WeakMap();

/**
   * Requests a list of the available media input and output devices, such as microphones and cameras.
   *
   * @returns Promise Array of MediaDeviceInfo objects
   */
const getDevices = async (): Promise<MediaDeviceInfo[]> => {
  if (!navigator.mediaDevices?.enumerateDevices) {
    console.warn('navigator.mediaDevices.enumerateDevices() is not supported.');

    return [];
  }

  return navigator.mediaDevices.enumerateDevices();
};

/**
 * Handles getting a list of video input devices
 *
 * @returns Promise Array of MediaDeviceInfo objects
 * @public
 */
export const getCameras = async (): Promise<Device[]> => {
  const devices = await getDevices();

  return devices
    .filter(({kind}) => kind === DeviceKinds.VIDEO_INPUT)
    .map((device) => new Device(device));
};

/**
 * Handles getting a list of audio input devices
 *
 * @returns Promise Array of MediaDeviceInfo objects
 * @public
 */
export const getMicrophones = async (): Promise<Device[]> => {
  const devices = await getDevices();

  return devices
    .filter(({kind}) => kind === DeviceKinds.AUDIO_INPUT)
    .map((device) => new Device(device));
};

/**
 * Handles getting a list of audio output devices
 *
 * @returns Promise Array of MediaDeviceInfo objects
 * @public
 */
export const getSpeakers = async (): Promise<Device[]> => {
  const devices = await getDevices();

  return devices
    .filter(({kind}) => kind === DeviceKinds.AUDIO_OUTPUT)
    .map((device) => new Device(device));
};

/**
 * Handles getting a track from either a provided device or a default device
 *
 * @param device - device object where the track will be retrieved from (optional)
 * @returns Promise of Track object
 */
export async function createAudioTrack(device?: DeviceInterface) : Promise<TrackInterface> {
  if (device && device.kind !== DeviceKinds.AUDIO_INPUT) {
    throw new Error(`Device ${device.ID} is not of kind AUDIO_INPUT`);
  }

  const deviceConfig = device
    ? {audio: {deviceId: {exact: device.ID}}}
    : {audio: true, video: false};
  const stream : MediaStream = await navigator.mediaDevices.getUserMedia(deviceConfig);
  const track: MediaStreamTrack = stream.getAudioTracks()[0];

  return new Promise((resolve, reject) => {
    if (track) {
      _streams.set(stream, stream.id);

      return resolve(new Track(track));
    }

    return reject(Error('Could not obtain an audio track'));
  });
}

export * from './Device';
export * from './Track';
