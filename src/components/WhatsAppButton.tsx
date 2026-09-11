export default function WhatsAppButton() {
  const phoneNumber = "919851350892";
  const defaultMessage = "Hello Parbati Interior! I am interested in your interior design and general construction services. I would love to schedule a consultation.";
  const encodedMessage = encodeURIComponent(defaultMessage);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  return (
    <a
      id="whatsapp-floating-button"
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-white text-gray-900 font-bold text-sm pl-2 pr-4 py-2 rounded-full shadow-2xl border border-gray-100 hover:scale-105 transition-transform duration-300"
      title="Contact Parbati Interior via WhatsApp"
    >
      <span className="relative flex items-center justify-center h-8 w-8 rounded-full bg-[#25D366] shrink-0">
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-75 animate-ping -z-10" />
        <svg viewBox="0 0 32 32" className="h-5 w-5 fill-white">
          <path d="M16.004 3C9.377 3 4 8.373 4 15c0 2.24.611 4.34 1.674 6.14L4 29l8.06-1.653A11.94 11.94 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3Zm0 21.75a9.7 9.7 0 0 1-4.95-1.356l-.355-.21-4.784.982.99-4.66-.232-.365A9.66 9.66 0 0 1 5.25 15c0-5.93 4.824-10.75 10.754-10.75S26.75 9.07 26.75 15 21.93 24.75 16.004 24.75Zm5.53-7.6c-.303-.152-1.793-.885-2.07-.986-.278-.101-.48-.152-.683.152-.202.303-.783.985-.96 1.187-.176.202-.353.227-.656.076-.303-.152-1.278-.472-2.435-1.505-.9-.803-1.508-1.794-1.685-2.097-.176-.303-.019-.467.133-.618.137-.136.303-.354.455-.53.152-.177.202-.303.303-.505.101-.203.05-.38-.025-.531-.076-.152-.683-1.65-.937-2.26-.247-.594-.497-.513-.683-.523l-.582-.01a1.12 1.12 0 0 0-.81.38c-.278.303-1.06 1.036-1.06 2.526s1.085 2.93 1.236 3.132c.152.202 2.135 3.26 5.173 4.573.723.312 1.287.499 1.727.639.726.231 1.386.198 1.908.12.582-.087 1.793-.733 2.046-1.44.253-.708.253-1.314.177-1.44-.076-.127-.278-.202-.581-.354Z" />
        </svg>
      </span>
      Message Us
    </a>
  );
}
