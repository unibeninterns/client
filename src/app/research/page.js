"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Header from "@/components/header";
import Link from "next/link";
import Footer from "@/components/footer";
import { articlesApi } from "@/lib/api";
import { getImageUrl } from "@/lib/utils";

export default function ResearchPage() {
  const [researchArticles, setResearchArticles] = useState([]);
  const [loadingArticles, setLoadingArticles] = useState(true);

  useEffect(() => {
    const fetchResearchArticles = async () => {
      try {
        const filters = {
          category: "Research",
        };
        const articles = await articlesApi.getPublicArticles(filters);
        setResearchArticles(articles.slice(0, 3)); // Get first 3 articles
      } catch (error) {
        console.error("Error fetching research articles:", error);
      } finally {
        setLoadingArticles(false);
      }
    };

    fetchResearchArticles();
  }, []);

  return (
    <main className="bg-white text-gray-800">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[60vh] w-full">
        <Image
          src="/publications.jpeg" // Use the appropriate image based on the prompt
          alt="UNIBEN Research Publications"
          fill
          className="object-cover brightness-75"
          priority
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6 backdrop-blur-xs">
          <h1 className="text-white text-4xl md:text-5xl font-bold">
            UNIBEN Research Publications
          </h1>
          <p className="text-white mt-4 text-lg md:text-xl max-w-3xl">
            Documenting Excellence, Disseminating Knowledge, Deepening Impact
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="px-6 md:px-20 py-16 space-y-8 max-w-5xl mx-auto">
        <p>
          The University of Benin is proud to be at the forefront of research
          publication and scholarly communication in Nigeria and West Africa.
          Our commitment to rigorous, impactful, and accessible research is
          reflected in a growing body of reports, academic journals, research
          bulletins, newsletters, and policy-oriented briefs—all curated to
          ensure that knowledge generated within the university is widely
          shared, applied, and celebrated.
        </p>

        <h2 className="text-2xl font-semibold text-fuchsia-700">
          Annual Research and Innovation Reports
        </h2>
        <p>
          Produced by the Directorate of Research, Innovation, and Development
          (DRID), these flagship reports offer a comprehensive overview of the
          university’s research achievements, grant successes, innovations,
          strategic partnerships, and capacity-building milestones.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Key funded research projects</li>
          <li>Strategic collaborations (local and international)</li>
          <li>Innovations and patents</li>
          <li>Capacity-building initiatives</li>
          <li>Researcher highlights and award winners</li>
          <li>Policy contributions and development impact</li>
        </ul>

        <h2 className="text-2xl font-semibold text-fuchsia-700">
          Research Bulletins
        </h2>
        <p>
          Our quarterly Research Bulletin delivers curated insights from across
          faculties and research centres. It features project summaries, calls
          for proposals, funding opportunities, publication trends, and
          commentary on emerging global issues.
        </p>

        <h2 className="text-2xl font-semibold text-fuchsia-700">
          UNIBEN Academic Journals
        </h2>
        <p>
          The university hosts and supports a growing collection of
          faculty-based academic journals, providing platforms for publishing
          peer-reviewed, original research across disciplines. These include:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Benin Journal of Public Law</li>
          <li>Journal of Tropical Agriculture</li>
          <li>Nigerian Journal of Clinical and Biomedical Research</li>
          <li>Benin Journal of Environmental Law and Policy</li>
          <li>Journal of Management and Social Sciences</li>
          <li>Benin Journal of Basic and Applied Sciences</li>
        </ul>
        <p>
          Efforts are ongoing to digitize, index, and standardize these journals
          to meet international best practices, increase citation visibility,
          and enhance global discoverability.
        </p>

        <p>
          Across its faculties and research centers, over 40 active journals
          capture groundbreaking studies and reflections in law, engineering,
          life sciences, pharmacy, gender studies, arts, sustainability, and
          more—shaping discourse, influencing policy, and advancing discovery.
        </p>

        <h2 className="text-2xl font-semibold text-fuchsia-700">
          Policy Briefs & Thematic Reports
        </h2>
        <p>
          UNIBEN researchers regularly produce policy briefs, working papers,
          and thematic reports focused on governance, health, education,
          agriculture, environmental justice, and more.
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            Reports on climate security and transboundary governance in West
            Africa
          </li>
          <li>Briefs on sustainable agriculture and agroecology</li>
          <li>
            Legal and institutional reviews for natural resource management
          </li>
          <li>
            Technical reports to funding agencies and government ministries
          </li>
        </ul>

        <h2 className="text-2xl font-semibold text-fuchsia-700">
          Outreach Publications & Knowledge Products
        </h2>
        <p>
          Through collaboration with external partners and donor agencies,
          UNIBEN researchers contribute to co-published materials such as:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Stakeholder validation workshop reports</li>
          <li>Regional fragility assessments</li>
          <li>Field documentation and community impact case studies</li>
          <li>Reports from international missions and consortia</li>
        </ul>
        <p>
          These materials reflect UNIBEN’s outward-facing research
          strategy—focused on translation, inclusion, and relevance.
        </p>
        <p>
          The University of Benin (UNIBEN) boasts a vibrant and diverse
          portfolio of scholarly journals, showcasing its strong commitment to
          interdisciplinary research, innovation, and knowledge dissemination.
          Across its faculties and research centers, over 40 active journals
          capture groundbreaking studies and reflections in fields ranging from
          law, engineering, life sciences, and management to pharmacy, gender
          studies, the arts, and environmental sustainability. These
          publications not only highlight the university’s intellectual depth
          but also serve as critical platforms for shaping national discourse,
          influencing policy, and advancing scientific discovery across Africa
          and beyond.
        </p>
        <p>
          Themes covered across UNIBEN journals reflect urgent global and local
          priorities—from climate resilience, gender justice, entrepreneurship,
          and biomedical innovations, to legal reform, educational technology,
          and sustainable development. With flagship journals like the
          University of Benin Law Journal, Tropical Journal of Pharmaceutical
          Research, and Nigerian Journal of Engineering and Environmental
          Sciences, UNIBEN’s publishing ecosystem remains a beacon for rigorous
          academic exchange and thought leadership.
        </p>
      </section>

      {/* CTA Section */}
      <section className="bg-fuchsia-900 py-12 px-6 md:px-20 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Explore Our Publications</h2>
        <p className="mb-6 max-w-2xl mx-auto">
          Dive into our journals, policy briefs, and thematic reports to see how
          UNIBEN is shaping scholarship and making an impact in Nigeria and
          beyond.
        </p>
        <Link
          href="#research-articles"
          className="bg-white text-fuchsia-900 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
        >
          Browse Articles
        </Link>
      </section>

      {/* Featured Research Articles */}
      <section
        id="research-articles"
        className="py-16 px-6 md:px-20 max-w-7xl mx-auto"
      >
        <h3 className="text-2xl font-bold text-gray-800 mb-8">
          Featured Research Publications & Articles
        </h3>

        {loadingArticles ? (
          <div className="text-center">Loading research articles...</div>
        ) : researchArticles.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-8">
            {researchArticles.map((article) => (
              <div
                key={article._id}
                className="group border rounded-lg overflow-hidden shadow-md bg-white transition-all duration-300 hover:shadow-2xl hover:scale-105 border-fuchsia-100 hover:border-fuchsia-200"
              >
                {article.cover_photo && (
                  <Image
                    src={getImageUrl(article.cover_photo)}
                    alt={article.title}
                    width={500}
                    height={300}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                )}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-fuchsia-900 mb-1 line-clamp-2 group-hover:text-fuchsia-700 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-2">
                    {article.summary}
                  </p>
                  <Link
                    href={`/articles/${article._id}`}
                    className="text-fuchsia-600 text-sm font-medium mt-3 inline-block"
                  >
                    Read more →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600">
            <p>No research articles available at the moment.</p>
            <p className="mt-2">Check back soon for updates!</p>
          </div>
        )}
      </section>
      <Footer />
    </main>
  );
}
