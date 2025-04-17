"use client";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Home() {
  return (
    <>
      <Header />
      <div className="w-full h-max min-h-10/12 text-white bg-gray-800 bg-[url('/hero-main.png')] bg-no-repeat bg-cover bg-center">
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
          <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-4 justify-center items-center space-x-0">
            <Link href="/research" className="w-max bg-default hover:bg-default text-white font-bold py-2 md:py-4 px-4 rounded-full flex justify-between space-x-1">
             <BookOpenCheck /> <span>Explore Research</span>
            </Link>
            <Link href="/innovation" className="w-max bg-default hover:bg-default text-white font-bold py-2 md:py-4 px-4 rounded-full flex justify-between space-x-1">
               <Brain /> <span>Discover Innovation</span>
            </Link>
            <Link href="/development" className="w-max bg-default hover:bg-default text-white font-bold py-2 md:py-4 px-4 rounded-full flex justify-between space-x-1">
             <Layers /> <span>Drive Development</span>
            </Link>
          </div>
        </div>
      </div>
      <main className="w-full bg-[url('/white-detail.png')] bg-no-repeat bg-fixed bg-cover bg-center">
        <section className="w-full px-4 md:px-[150px] py-10 md:py-20">
          <div className="h-1 w-40 bg-black mb-5"></div>
          <h2 className="text-xl md:text-3xl text-default font-bold">Advancing Research for Sustainable Development at the University of Benin</h2>
          <div className="w-full py-4 px-2 md:px-6 rounded-sm bg-gray-200/80 my-10 text-black">
          <p className="mb-5 text-base md:text-lg font-medium">Following the adoption of the United Nations Sustainable Development Goals (SDGs) in 2015 and the African Union’s Agenda 2063, the University of Benin (UNIBEN) began a progressive alignment of its research priorities to these global and continental development frameworks. Over the years, our researchers and faculties have continued to respond to the urgent need for innovative, context-driven research that directly addresses Nigeria’s and Africa’s most pressing challenges.</p>
          <p className="mb-5 text-base md:text-lg font-medium">UNIBEN’s interdisciplinary research culture is grounded in practical engagement with societal issues such as environmental degradation, public health, poverty alleviation, gender equity, responsible governance, and sustainable livelihoods. Several of our academic leaders and research teams have been actively contributing to national and regional policy dialogues, supporting implementation of climate action strategies, and promoting inclusive education and justice – all of which are central to the SDGs.</p>
          <p className="mb-5 text-base md:text-lg font-medium">Notably, the Directorate of Research, Innovation, and Development (DRID) has taken a lead role in mainstreaming the SDGs into our research governance. This includes encouraging grant-winning proposals that explicitly link to one or more of the goals, strengthening partnerships with government, civil society, and the private sector, and developing a research repository that highlights SDG-focused outputs. Collaborations with international development agencies, including the African Development Bank, UNDP, and the Green Climate Fund, have enabled our scholars to make practical contributions to sustainable development in Nigeria and the wider West African sub-region.</p>
          <p className="mb-5 text-base md:text-lg font-medium">Our efforts are also aligned with the African Union’s Agenda 2063 – “The Africa We Want.” UNIBEN has contributed to regional efforts on climate security in the Sahel, sustainable agriculture, and youth capacity development, in line with the aspirations of a prosperous, integrated, and peaceful Africa. Our participation in cross-border research on transboundary eco-security, food systems transformation, and digital innovation showcases our commitment to locally relevant, globally informed scholarship.</p>
          <p className="mb-5 text-base md:text-lg font-medium">A university rooted in the heart of Benin City, UNIBEN recognizes its responsibility to lead by example. We have taken steps to promote environmental sustainability across our campus, including the integration of renewable energy solutions, improved waste management systems, and the promotion of sustainability literacy through student-led initiatives. Plans are also underway to develop a formal environmental sustainability framework in line with national and international benchmarks.</p>
          <p className="mb-5 text-base md:text-lg font-medium">Through our Vision 2025 and beyond, the University of Benin is strengthening its role as a knowledge institution committed to solving real-world problems and nurturing research that is impactful, inclusive, and transformative. Our motto, “Knowledge for Service,” resonates now more than ever, as we work to ensure that our research outcomes contribute meaningfully to the SDGs and a more just and resilient society.</p>
          </div>
          <div className="h-1 w-1/3 bg-black mt-5 place-self-end"></div>
        </section>
        <section className="w-full bg-white px-4 md:px-[250px] py-10 md:py-20">
          <div className="w-full h-max min-h-56 flex md:flex-row flex-col-reverse space-x-0 space-y-4 md:space-y-0 md:space-x-6 md:justify-between md:items-start rounded-lg bg-black p-3 md:p-6 md:px-16">
            <div className="w-full h-max md:w-1/2 text-white mt-2 md:mt-0">
              <h2 className="text-2xl md:text-4xl font-bold"><span className="text-base text-default block">UNIBEN Research:</span><span className="block mt-2">Cultivating Excellence, Driving Development</span></h2>
              <p className="mt-6 text-base font-medium">
              At the University of Benin, research is more than a mandate—it is a mission. As a powerhouse of innovation, UNIBEN is home to a vibrant and growing community of researchers who are unlocking solutions to some of Africa’s most complex and urgent challenges. Whether addressing national security through public policy reform or advancing biotechnology in agriculture, our scholars are creating knowledge that matters.
              </p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href="/research-news" className="w-max block text-center text-base px-3 py-2 md:px-5 rounded-full border-2 border-solid mt-8 hover:bg-default">LEARN MORE</Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>READ MORE ON OUR RESEARCH NEWS PAGE</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="w-full h-full md:w-1/2">
              <Image src={"/research-news.jpeg"} alt="Research news Illustration" title="Research news illustration" width={150} height={150} className="w-full h-full" />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
