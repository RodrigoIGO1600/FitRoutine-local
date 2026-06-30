import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { QRCodeSVG } from "qrcode.react";
import { API_URL } from "../api/client";
import "./DesktopQR.css";

export function DesktopQR() {
  const [url, setUrl] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    async function fetchIP() {
      try {
        const base = API_URL.replace("/api", "");
        const res = await fetch(`${base}/api/network/ip`);
        const data = await res.json();
        setUrl(`http://${data.ip}:5173`);
      } catch {
        setUrl(null);
      }
    }
    fetchIP();
  }, []);

  if (!url) return null;

  return (
    <div className="desktop-qr">
      <button
        type="button"
        className="desktop-qr__toggle"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Cerrar código QR" : "Abrir código QR"}
      >
        <Icon icon="solar:iphone-linear" width={20} height={20} />
      </button>

      {isOpen && (
        <div className="desktop-qr__card">
          <QRCodeSVG
            value={url}
            size={100}
            bgColor="transparent"
            fgColor="#ffffff"
          />
          <p className="desktop-qr__text">Escanea para abrir en tu celular</p>
        </div>
      )}
    </div>
  );
}
