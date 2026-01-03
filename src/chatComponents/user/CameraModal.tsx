import { useEffect, useRef, useState } from 'react';

type CameraModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

function CameraModal({ isOpen, onClose }: CameraModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [volume, setVolume] = useState(0);

  // ---------- Start devices ----------
  const startDevices = async () => {
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    setStream(mediaStream);

    if (videoRef.current) {
      videoRef.current.srcObject = mediaStream;
    }

    setupAudioMeter(mediaStream);
  };

  // ---------- Audio volume meter ----------
  const setupAudioMeter = (mediaStream: MediaStream) => {
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const microphone = audioContext.createMediaStreamSource(mediaStream);

    analyser.fftSize = 256;
    microphone.connect(analyser);

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const tick = () => {
      analyser.getByteFrequencyData(dataArray);
      const avg =
        dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
      setVolume(avg);
      requestAnimationFrame(tick);
    };

    tick();
  };

  // ---------- Toggle camera ----------
  const toggleCamera = () => {
    stream?.getVideoTracks().forEach((track) => {
      track.enabled = !cameraOn;
    });
    setCameraOn((prev) => !prev);
  };

  // ---------- Toggle mic ----------
  const toggleMic = () => {
    stream?.getAudioTracks().forEach((track) => {
      track.enabled = !micOn;
    });
    setMicOn((prev) => !prev);
  };

  // ---------- Cleanup ----------
  useEffect(() => {
    if (isOpen) startDevices();

    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-[#1e1f22] text-white p-6 rounded-xl w-[420px]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4">Camera & Mic Test</h2>

        {/* Video */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-48 bg-black rounded mb-4"
        />

        {/* Volume meter */}
        <div className="mb-4">
          <div className="text-sm mb-1">Microphone Level</div>
          <div className="w-full h-3 bg-gray-700 rounded">
            <div
              className="h-full bg-green-500 rounded"
              style={{ width: `${Math.min(volume * 1.5, 100)}%` }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          <button
            onClick={toggleCamera}
            className="flex-1 bg-gray-700 hover:bg-gray-600 py-2 rounded"
          >
            {cameraOn ? 'Turn Camera Off' : 'Turn Camera On'}
          </button>

          <button
            onClick={toggleMic}
            className="flex-1 bg-gray-700 hover:bg-gray-600 py-2 rounded"
          >
            {micOn ? 'Mute Mic' : 'Unmute Mic'}
          </button>
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full bg-red-600 hover:bg-red-700 py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default CameraModal;
