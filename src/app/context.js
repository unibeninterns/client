// Use the this code as context for an artcile content page, I want it to copy the url link at that moment to the clipboard when the user clicks on the share button.
{
  /* Navigation */
}
<div className="flex items-center justify-between mb-6 sm:mb-8">
  <Button
    variant="outline"
    onClick={() => router.back()}
    className="flex items-center gap-2 hover:bg-fuchsia-50 hover:border-fuchsia-300 transition-all duration-200"
  >
    <ArrowLeft className="h-4 w-4" /> Back
  </Button>

  <Button
    variant="ghost"
    size="sm"
    className="flex items-center gap-2 text-fuchsia-700 hover:bg-fuchsia-100 transition-colors"
  >
    <Share2 className="h-4 w-4" />
    <span className="hidden sm:inline">Share</span>
  </Button>
</div>;
