import { MessageCircle } from "lucide-react";
import { WHATSAPP_URL } from "../../data/constants.js";

export default function WhatsAppFab() {
  return (
    <a
      href={`${WHATSAPP_URL}?text=${encodeURIComponent(
        "Hi Kalakriti Art Studio! I'd like to know more about your classes."
      )}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105"
    >
      <MessageCircle size={28} />
    </a>
  );
}
