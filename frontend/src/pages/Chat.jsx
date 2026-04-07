import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TechBanOverlay from "../components/TechBanOverlay";

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Helper function to get current user ID from token
function getCurrentUserId() {
  try {
    const token = localStorage.getItem("fixfast_token");
    if (!token) return null;
    
    // Decode JWT token to get user ID
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.userId || payload.id;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}

export default function Chat({ role = "user" }) {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [banInfo, setBanInfo] = useState(JSON.parse(localStorage.getItem("fixfast_ban_info") || "null"));

  const checkBanResponse = async (response) => {
    if (role === "provider" && response.status === 403) {
      const data = await response.json().catch(() => ({}));
      if (data.banned) {
        const info = {
          reason: data.message,
          until: data.banUntil
        };
        localStorage.setItem("fixfast_ban_info", JSON.stringify(info));
        setBanInfo(info);
        return true;
      }
    }
    return false;
  };

  const markMessagesAsRead = async () => {
    try {
      const token = localStorage.getItem("fixfast_token");
      if (!token) return;

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/chat/${bookingId}/mark-read`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        // Update local messages to mark as read
        setMessages(prev => prev.map(msg => ({ ...msg, isRead: true })));
      } else {
        await checkBanResponse(res);
      }
    } catch (error) {
      console.error("Failed to mark messages as read", error);
    }
  };

  const loadMessages = async () => {
    try {
      const token = localStorage.getItem("fixfast_token");
      if (!token) return;

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/chat/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setMessages(await res.json());
      } else {
        await checkBanResponse(res);
      }
    } catch (error) {
      console.error("Failed to load messages", error);
    }
  };

  const loadBooking = async () => {
    try {
      const token = localStorage.getItem("fixfast_token");
      if (!token) return;
      
      const endpoint = role === "provider" ? "/api/bookings/provider" : "/api/bookings/my";
      const res = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const bookings = await res.json();
        const b = bookings.find(item => item._id === bookingId);
        setBooking(b);
      } else {
        await checkBanResponse(res);
      }
    } catch (error) {
      console.error("Failed to load booking", error);
    }
  };

  useEffect(() => {
    loadBooking();
    loadMessages();
    markMessagesAsRead();

    // Add polling for real-time updates
    const interval = setInterval(() => {
      loadMessages();
    }, 2000);

    return () => clearInterval(interval);
  }, [bookingId]);

  const sendTextMessage = async () => {
    const value = text.trim();
    if (!value) return;

    try {
      const token = localStorage.getItem("fixfast_token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/chat/send`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ bookingId, message: value, image: "" })
      });

      if (res.ok) {
        setText("");
        loadMessages();
      } else {
        await checkBanResponse(res);
      }
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const base64 = await fileToBase64(file);
      const token = localStorage.getItem("fixfast_token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/chat/send`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        // We'll set the message to the filename if they upload an image
        body: JSON.stringify({ bookingId, message: file.name, image: base64 })
      });

      if (res.ok) {
        e.target.value = "";
        loadMessages();
      } else {
        if (!(await checkBanResponse(res))) {
          alert("Image might be too large! Try a smaller image.");
        }
      }
    } catch (error) {
      console.error("Failed to send image", error);
      alert("Failed to upload image. It might be too large.");
    }
  };

  if (role === "provider" && banInfo) {
    return <TechBanOverlay banInfo={banInfo} />;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="rounded-3xl border bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-extrabold text-gray-900">Chat</h1>

        {booking ? (
          <div className="mt-3 rounded-2xl bg-gray-50 p-4">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Service:</span> {booking.serviceName}
            </p>
            {booking.providerName && (
              <p className="mt-1 text-sm text-gray-700">
                <span className="font-semibold">Technician:</span> {booking.providerName}
              </p>
            )}
            <p className="mt-1 text-sm text-gray-700">
              <span className="font-semibold">Status:</span> {booking.status}
            </p>
          </div>
        ) : (
          <p className="mt-3 text-sm text-red-600">Booking not found or not authorized.</p>
        )}

        <div className="mt-6 h-[420px] overflow-y-auto rounded-2xl border bg-gray-50 p-4 flex flex-col gap-4">
          {messages.length === 0 ? (
            <p className="text-sm text-gray-500">No messages yet.</p>
          ) : (
            messages.map((msg) => {
              const currentUserId = getCurrentUserId();
              const isMe = msg.senderId === currentUserId;

              return (
                <div key={msg._id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                  <div className={`inline-block p-3 rounded-xl max-w-xs 
                    ${isMe ? "bg-green-500 text-white" : "bg-gray-200 text-black"}`}>
                    
                    {msg.message && <p className="text-sm break-words">{msg.message}</p>}
                    
                    {msg.imageUrl && (
                      <img
                        src={msg.imageUrl}
                        alt="chat"
                        onClick={() => setPreviewImage(msg.imageUrl)}
                        className="mt-2 rounded-lg max-w-[250px] max-h-[250px] object-cover cursor-pointer"
                      />
                    )}
                    
                    <span className="text-xs block mt-1 opacity-70">
                      {isMe ? "You" : (msg.senderType === "user" ? "User" : "Technician")}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="mt-5 flex flex-col gap-3 md:flex-row">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendTextMessage()}
            placeholder="Type your message..."
            className="flex-1 rounded-2xl border px-4 py-3 outline-none focus:ring-2 focus:ring-brand-200"
          />

          <label className="cursor-pointer rounded-2xl border px-4 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 flex items-center justify-center">
            Send Image
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>

          <button
            onClick={sendTextMessage}
            className="rounded-2xl bg-brand-600 px-6 py-3 font-semibold text-white transition hover:bg-brand-700"
          >
            Send
          </button>
        </div>
      </div>

      {/* Full Screen Image Modal */}
      {previewImage && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="relative">
            <img
              src={previewImage}
              className="max-w-[90vw] max-h-[90vh] rounded-lg"
            />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-2 right-2 bg-white px-3 py-1 rounded"
            >
              Close
            </button>
            <a
              href={previewImage}
              download
              className="absolute bottom-2 right-2 bg-green-600 text-white px-4 py-2 rounded"
            >
              Download
            </a>
          </div>
        </div>
      )}
    </div>
  );
}