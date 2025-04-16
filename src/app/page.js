import Image from "next/image";
import Header from "@/components/header";
import Link from "next/link";
import {
  Microscope,
  FlaskConical,
  BookOpenCheck,
  Brain,
  Layers,
} from "lucide-react";

export default function Home() {
  return (
    <>
      <Header />
      <div className="w-full h-10/12 text-white bg-gray-800 bg-hero-main bg-no-repeat bg-cover bg-center">
        <div className="w-full h-full backdrop-blur-xs py-16 md:py-24 xl:py-36 px-4 text-center">
          <h1 className="text-4xl font-bold mb-6 md:mb-8 md:text-6xl">
            Advancing Knowledge.<br/>Fueling Innovation.<br/>Driving Development.
          </h1>
          <p className="text-lg mb-6">
            At the Department of Research, Innovation, and Development, we empower bold ideas, support pioneering research, and create solutions that shape tomorrow.
          </p>
          <p className="text-base italic mb-8">
            Explore how we lead breakthroughs in science, technology, and societal transformation.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/research" className="bg-default hover:bg-default text-white font-bold py-2 md:py-4 px-4 rounded-full flex justify-between space-x-1">
             <BookOpenCheck /> <span>Explore Research</span>
            </Link>
            <Link href="/innovation" className="bg-default hover:bg-default text-white font-bold py-2 md:py-4 px-4 rounded-full flex justify-between space-x-1">
               <Brain /> <span>Discover Innovation</span>
            </Link>
            <Link href="/development" className="bg-default hover:bg-default text-white font-bold py-2 md:py-4 px-4 rounded-full flex justify-between space-x-1">
             <Layers /> <span>Drive Development</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
