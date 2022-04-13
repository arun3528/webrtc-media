import {RTCPeerConnectionMocks} from '../Media/Device/DeviceMocks';
import {ConnectionState, MediaConnection} from './index';

describe('MediaConnection', () => {
  beforeAll(() => {
    RTCPeerConnectionMocks();
  });
  it('initial media connection state is NEW', () => {
    const mediaConnection = new MediaConnection(
      {
        iceServers: [],
        sdpMunging: {convertPort9to0: false},
      },
      {
        send: {},
        receive: {
          audio: true,
          video: true,
          screenShareVideo: true,
        },
      }
    );

    expect(mediaConnection.getConnectionState()).toEqual(ConnectionState.NEW);
  });
});
