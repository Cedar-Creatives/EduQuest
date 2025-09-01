import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import {
  ArrowLeft,
  Download,
  Share2,
  Bookmark,
  Star,
  Clock,
  User,
  Printer,
  Eye
} from "lucide-react"
import { getNote } from "@/api/notes"
import { useToast } from "@/hooks/useToast"

export function NoteViewer() {
  const { noteId } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [note, setNote] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [bookmarked, setBookmarked] = useState(false)

  useEffect(() => {
    const fetchNote = async () => {
      try {
        console.log(`Fetching note: ${noteId}`)
        const data = await getNote(noteId!)
        setNote(data.note)
      } catch (error: any) {
        console.error('Error fetching note:', error)
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        })
        navigate('/notes')
      } finally {
        setLoading(false)
      }
    }

    fetchNote()
  }, [noteId, navigate, toast])

  const handleBookmark = () => {
    setBookmarked(!bookmarked)
    toast({
      title: bookmarked ? "Bookmark removed" : "Bookmark added",
      description: bookmarked ? "Note removed from bookmarks" : "Note added to bookmarks"
    })
  }

  const handleDownload = () => {
    toast({
      title: "Download started",
      description: "Note is being downloaded as PDF"
    })
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast({
      title: "Link copied",
      description: "Note link copied to clipboard"
    })
  }

  const handlePrint = () => {
    window.print()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading note...</p>
        </div>
      </div>
    )
  }

  if (!note) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">Note not found</p>
        <Button onClick={() => navigate('/notes')} className="mt-4">
          Back to Notes Library
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => navigate('/notes')}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Library</span>
        </Button>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBookmark}
            className={bookmarked ? 'bg-yellow-50 border-yellow-300 text-yellow-700' : ''}
          >
            <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Note Header */}
      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-3xl mb-4">{note.title}</CardTitle>
              <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-400">
                <span className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  {note.authorName || 'Unknown Author'}
                </span>
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {note.readTime} min read
                </span>
                <span className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  {note.views || 0} views
                </span>
                <span className="flex items-center">
                  <Star className="w-4 h-4 mr-1 text-yellow-500" />
                  {note.rating || 0} ({note.reviews || 0} reviews)
                </span>
              </div>
            </div>
            <Badge variant="outline" className="ml-4">
              {note.subject}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Note Content */}
      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-8">
          <div className="prose prose-lg max-w-none dark:prose-invert">
            {note.content.split('\n').map((line: string, index: number) => {
              if (line.startsWith('# ')) {
                return (
                  <h1 key={index} className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                    {line.substring(2)}
                  </h1>
                )
              }
              if (line.startsWith('## ')) {
                return (
                  <h2 key={index} className="text-2xl font-semibold mb-4 mt-8 text-gray-900 dark:text-white">
                    {line.substring(3)}
                  </h2>
                )
              }
              if (line.startsWith('### ')) {
                return (
                  <h3 key={index} className="text-xl font-semibold mb-3 mt-6 text-gray-900 dark:text-white">
                    {line.substring(4)}
                  </h3>
                )
              }
              if (line.startsWith('- ')) {
                return (
                  <li key={index} className="mb-2 text-gray-700 dark:text-gray-300">
                    {line.substring(2)}
                  </li>
                )
              }
              if (line.trim() === '') {
                return <br key={index} />
              }
              return (
                <p key={index} className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                  {line}
                </p>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Related Notes */}
      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Related Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: 'Advanced Calculus Concepts', subject: 'Mathematics', readTime: 30 },
              { title: 'Calculus Applications in Physics', subject: 'Science', readTime: 25 }
            ].map((relatedNote, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {relatedNote.title}
                  </h4>
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <Badge variant="outline">{relatedNote.subject}</Badge>
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {relatedNote.readTime} min
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quiz Suggestions */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
        <CardHeader>
          <CardTitle>Test Your Knowledge</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-blue-100 mb-4">
            Ready to test what you've learned? Take a quiz on {note.subject.toLowerCase()}.
          </p>
          <Button
            onClick={() => navigate('/quiz')}
            className="bg-white text-blue-600 hover:bg-gray-100"
          >
            Take a Quiz
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}