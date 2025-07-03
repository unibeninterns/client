// Use only the hover effects for the articles cards as context.
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
  {results.map((article) => (
    <Link
      href={`/articles/${article._id}`}
      key={article._id}
      className="group bg-white shadow-lg rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 border border-fuchsia-100 hover:border-fuchsia-200"
    >
      <div className="relative">
        <div className="absolute top-4 left-4 z-10">
          <span className="inline-flex items-center px-3 py-1 bg-fuchsia-900 text-white text-xs font-bold rounded-full uppercase tracking-wide">
            <BookOpen size={12} className="mr-1" />
            {article.category}
          </span>
        </div>
        {article.cover_photo ? (
          <Image
            src={getImageUrl(article.cover_photo)}
            alt={article.title}
            width={400}
            height={240}
            className="w-full h-48 sm:h-56 object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-48 sm:h-56 bg-gradient-to-br from-fuchsia-100 to-fuchsia-200 flex items-center justify-center">
            <BookOpen size={48} className="text-fuchsia-400" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-bold text-fuchsia-900 mb-3 line-clamp-2 group-hover:text-fuchsia-700 transition-colors">
          {article.title}
        </h3>

        <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">
          {article.summary}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {article.department?.title && (
            <span className="px-2 py-1 bg-fuchsia-100 text-fuchsia-700 text-xs rounded-full">
              {article.department.title}
            </span>
          )}
        </div>

        <div className="flex justify-between items-center text-xs text-gray-500 pt-4 border-t border-fuchsia-50">
          <div className="flex items-center gap-1">
            <Calendar size={12} />
            <span>{new Date(article.publish_date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={12} />
            <span>
              {calculateReadingTime(article.content || article.summary || "")}{" "}
              min
            </span>
          </div>
        </div>
      </div>
    </Link>
  ))}
</div>;
