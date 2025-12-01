'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Bluetooth, 
  BluetoothSearching, 
  BluetoothConnected, 
  BluetoothOff, 
  RefreshCw, 
  X, 
  Terminal, 
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BluetoothPage() {
  // --- State ---
  const [supported, setSupported] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [status, setStatus] = useState('');
  const [devices, setDevices] = useState([]);
  const [saved, setSaved] = useState([]);
  const [connectedId, setConnectedId] = useState(null);
  const [gattServer, setGattServer] = useState(null);
  const [logs, setLogs] = useState([]);
  const [showLogs, setShowLogs] = useState(false);

  const requestOptions = {
    acceptAllDevices: true,
    optionalServices: [
      'device_information',
      'battery_service',
    ],
  };

  useEffect(() => {
    if (typeof navigator !== 'undefined' && !navigator.bluetooth) {
      setSupported(false);
      setStatus('Web Bluetooth is not supported in this browser.');
    }

    try {
      const savedJSON = localStorage.getItem('rs_bt_devices');
      if (savedJSON) setSaved(JSON.parse(savedJSON));
    } catch (e) {
      console.error("Error loading saved devices:", e);
    }
  }, []);

  const log = (msg) => {
    console.log(msg);
    setLogs((l) => [`${new Date().toLocaleTimeString()} • ${msg}`, ...l].slice(0, 50));
  };

  const onScan = async () => {
    if (!supported) return;
    
    try {
      setScanning(true);
      setStatus('Scanning for devices...');
      
      const device = await navigator.bluetooth.requestDevice(requestOptions);
      
      if (!device) {
        setStatus('No device selected.');
        return;
      }

      setDevices((d) => {
        const exists = d.find((x) => x.id === device.id);
        return exists ? d : [{ id: device.id, name: device.name || 'Unnamed Device', device }, ...d];
      });

      setStatus(`Selected: ${device.name || 'Unknown'}`);
      log(`Selected: ${device.name} (${device.id})`);
      
    } catch (e) {
      setStatus('Scan cancelled or failed.');
      log(`Scan Error: ${e.message}`);
    } finally {
      setScanning(false);
    }
  };

  const onConnect = async (entry) => {
    if (!entry) return;

    try {
      setConnecting(true);
      setStatus(`Connecting to ${entry.name}...`);
      log(`Connecting to ${entry.id}...`);

      let device = entry.device;
      if (!device) {
        device = await navigator.bluetooth.requestDevice({
          filters: [{ name: entry.name }],
          optionalServices: requestOptions.optionalServices
        });
      }

      device.addEventListener('gattserverdisconnected', handleDisconnect);
      
      const server = await device.gatt.connect();
      setGattServer(server);
      setConnectedId(device.id);
      setStatus(`Connected to ${entry.name}`);
      log(`Connected!`);

      try {
        const battService = await server.getPrimaryService('battery_service');
        const battChar = await battService.getCharacteristic('battery_level');
        const value = await battChar.readValue();
        const level = value.getUint8(0);
        log(`Battery Level: ${level}%`);
      } catch (e) {
      }

      const newSaved = [
        { id: device.id, name: device.name || entry.name }, 
        ...saved.filter((s) => s.id !== device.id)
      ].slice(0, 5);
      
      setSaved(newSaved);
      localStorage.setItem('rs_bt_devices', JSON.stringify(newSaved));

    } catch (e) {
      setStatus('Connection failed.');
      log(`Connect Error: ${e.message}`);
    } finally {
      setConnecting(false);
    }
  };

  const onDisconnect = () => {
    if (gattServer && gattServer.connected) {
      gattServer.disconnect();
    } else {
      handleDisconnect();
    }
  };

  const handleDisconnect = () => {
    setConnectedId(null);
    setGattServer(null);
    setStatus('Disconnected.');
    log('Device disconnected.');
  };

  const forgetDevice = (e, id) => {
    e.stopPropagation();
    const next = saved.filter((s) => s.id !== id);
    setSaved(next);
    localStorage.setItem('rs_bt_devices', JSON.stringify(next));
  };

  const cardVariant = { hidden: { opacity: 0, scale: 0.98 }, show: { opacity: 1, scale: 1, transition: { duration: 0.4 } } };
  const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };
  const list = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };

  return (
    <div className="fixed inset-0 w-full h-full bg-[#0A192F] text-white flex items-center justify-center overflow-hidden font-sans">
      
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-cyan-900/20 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        className="w-full h-full md:w-[90%] md:max-w-5xl md:h-[85vh] bg-[#112240] md:rounded-2xl flex flex-col shadow-2xl relative border-0 md:border border-white/10 overflow-hidden shrink-0 z-10"
        variants={cardVariant}
        initial="hidden"
        animate="show"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-white/5 relative z-10 shrink-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => window.location.href = '/'} 
              className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors"
              title="Go Back"
            >
              <ArrowLeft size={20} />
            </button>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${connectedId ? 'bg-green-600' : 'bg-blue-600'}`}>
                {connectedId ? <BluetoothConnected size={16} /> : <Bluetooth size={16} />}
            </div>
            <h1 className="font-semibold text-lg tracking-wide text-white">Bluetooth</h1>
          </div>
          
          <div className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-lg border ${supported ? 'border-green-500/30 text-green-400 bg-green-500/10' : 'border-red-500/30 text-red-400 bg-red-500/10'}`}>
            <span className={`w-2 h-2 rounded-full ${supported ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            {supported ? 'Active' : 'Unsupported'}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 scrollbar-thin scrollbar-thumb-white/10">
          
          <div className="flex flex-col items-center justify-center space-y-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center"
            >
              <p className="text-base text-slate-300 font-medium mb-1 h-6">{status || 'Ready to scan'}</p>
              {scanning && <p className="text-xs text-blue-400 animate-pulse">Searching for nearby devices...</p>}
            </motion.div>

            <div className="w-full max-w-md">
              {connectedId ? (
                <button
                  onClick={onDisconnect}
                  className="w-full py-3 bg-red-600 hover:bg-red-500 rounded-xl font-semibold shadow-lg shadow-red-900/20 transition-transform active:scale-95 flex items-center justify-center gap-2"
                >
                  <BluetoothOff size={18} /> Disconnect
                </button>
              ) : (
                <button
                  onClick={onScan}
                  disabled={!supported || scanning}
                  className={`w-full py-3 rounded-xl font-semibold shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 ${
                    scanning 
                      ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20'
                  }`}
                >
                  {scanning ? <RefreshCw size={18} className="animate-spin" /> : <BluetoothSearching size={18} />}
                  {scanning ? 'Scanning...' : 'Scan New Device'}
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            
            <motion.div variants={list} initial="hidden" animate="show" className="space-y-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1 border-b border-white/5 pb-2">
                Discovered Devices
              </h3>
              
              {devices.length === 0 ? (
                <div className="p-8 rounded-xl border border-dashed border-white/10 text-center bg-white/5">
                  <BluetoothSearching size={24} className="mx-auto text-slate-600 mb-2" />
                  <p className="text-sm text-slate-500">No devices found yet.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {devices.map((device) => (
                    <motion.button
                      key={device.id}
                      variants={item}
                      onClick={() => onConnect(device)}
                      disabled={connecting}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                        connectedId === device.id 
                          ? 'bg-green-500/10 border-green-500/50' 
                          : 'bg-[#173C5C] border-white/5 hover:border-blue-400/50 hover:bg-[#1f4b70]'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-full ${connectedId === device.id ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/10 text-blue-400'}`}>
                          <Bluetooth size={20} />
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-medium text-white">{device.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono opacity-70">{device.id.slice(0, 18)}...</div>
                        </div>
                      </div>
                      {connectedId === device.id && <div className="text-xs text-green-400 font-bold px-2">LINKED</div>}
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>

            <div className="space-y-6">
              
              <motion.div variants={list} initial="hidden" animate="show" className="space-y-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1 border-b border-white/5 pb-2">
                  Saved Devices
                </h3>
                {saved.length === 0 ? (
                   <div className="p-4 text-center">
                      <p className="text-sm text-slate-600 italic">Connected devices will appear here.</p>
                   </div>
                ) : (
                  <div className="space-y-2">
                    {saved.map((device) => (
                      <motion.div
                        key={device.id}
                        variants={item}
                        onClick={() => onConnect(device)}
                        className="w-full flex items-center justify-between p-3 rounded-xl bg-[#0A192F] border border-white/5 hover:border-white/20 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <Bluetooth size={16} className="text-slate-500" />
                          <div className="text-left">
                            <div className="text-sm font-medium text-slate-300">{device.name}</div>
                          </div>
                        </div>
                        <button 
                          onClick={(e) => forgetDevice(e, device.id)}
                          className="p-2 hover:bg-red-500/20 rounded-full text-slate-600 hover:text-red-400 transition-colors"
                          title="Forget Device"
                        >
                          <Trash2 size={14} />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>

              <div className="pt-4 border-t border-white/5">
                <button 
                  onClick={() => setShowLogs(!showLogs)}
                  className="flex items-center gap-2 text-xs text-slate-500 hover:text-blue-400 transition-colors"
                >
                  <Terminal size={14} />
                  {showLogs ? 'Hide Debug Logs' : 'Show Debug Logs'}
                </button>

                <AnimatePresence>
                  {showLogs && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-3 bg-black/40 rounded-lg p-3 font-mono text-[10px] text-green-400/80 overflow-hidden border border-white/5 max-h-40 overflow-y-auto"
                    >
                      {logs.length === 0 ? (
                        <div className="opacity-50 italic">Waiting for events...</div>
                      ) : (
                        logs.map((log, i) => <div key={i} className="mb-1 border-b border-white/5 pb-1 last:border-0">{log}</div>)
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
}