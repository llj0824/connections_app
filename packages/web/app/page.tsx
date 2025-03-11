import Image from "next/image";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto py-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to Connection App</h1>
        <p className="text-xl text-gray-600">Connect with people, join events, and chat in real-time</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <FeatureCard 
          title="Find Events" 
          description="Discover and join events happening around you"
          icon="🗓️"
          link="/events"
        />
        <FeatureCard 
          title="Connect" 
          description="Meet new people with similar interests"
          icon="👥"
          link="/events"
        />
        <FeatureCard 
          title="Chat" 
          description="Message event participants in real-time"
          icon="💬"
          link="/events"
        />
      </div>

      <div className="bg-blue-50 p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Browse <a href="/events" className="text-blue-600 hover:underline">available events</a></li>
          <li>Click on an event to see details and join</li>
          <li>Once joined, you can chat with other participants</li>
          <li>Create your own events to meet people</li>
        </ol>
      </div>
    </div>
  );
}

function FeatureCard({ title, description, icon, link }: { 
  title: string; 
  description: string; 
  icon: string;
  link: string;
}) {
  return (
    <a 
      href={link}
      className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </a>
  );
}
