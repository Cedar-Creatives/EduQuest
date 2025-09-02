import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  BookOpen,
  Download,
  Eye,
  Upload,
  Star,
  Clock,
  User,
  FileText,
  Grid,
  List,
  Trash2,
} from "lucide-react";
import { getNotes, uploadNote, deleteNote } from "@/api/notes";
import { useToast } from "@/hooks/useToast";
import { useAuth } from "@/contexts/AuthContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function NotesLibrary() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  const subjects = [
    "all",
    "Mathematics",
    "Science",
    "History",
    "Literature",
    "Biology",
    "Programming",
  ];

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        console.log("Fetching notes library...");
        const data = await getNotes();
        setNotes(data.notes || []);
      } catch (error: any) {
        console.error("Error fetching notes:", error);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [toast]);

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject =
      selectedSubject === "all" || note.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const handleViewNote = (noteId: string) => {
    console.log(`Opening note: ${noteId}`);
          navigate(`/app/notes/${noteId}`);
  };

  const handleDeleteNote = async (noteId: string, noteTitle: string) => {
    try {
      setDeleteLoading(noteId);
      console.log(`Deleting note: ${noteId}`);
      await deleteNote(noteId);

      // Remove the note from the local state
      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== noteId));

      toast({
        title: "Note deleted",
        description: `"${noteTitle}" has been deleted successfully`,
      });
    } catch (error: any) {
      console.error("Error deleting note:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setDeleteLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Notes Library
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Access comprehensive study materials and notes
          </p>
        </div>
        {user?.plan === "premium" && (
          <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
            <Upload className="w-4 h-4 mr-2" />
            Upload Note
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Subject Filter */}
            <div className="flex flex-wrap gap-2">
              {subjects.map((subject) => (
                <Button
                  key={subject}
                  variant={selectedSubject === subject ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSubject(subject)}
                  className="capitalize"
                >
                  {subject}
                </Button>
              ))}
            </div>

            {/* View Mode Toggle */}
            <div className="flex border rounded-lg">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-l-none"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes Grid/List */}
      {filteredNotes.length === 0 ? (
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No notes found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm || selectedSubject !== "all"
                ? "Try adjusting your search or filters"
                : "No notes available in the library yet"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }
        >
          {filteredNotes.map((note) => (
            <Card
              key={note._id}
              className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer ${
                viewMode === "list" ? "flex" : ""
              }`}
            >
              {viewMode === "grid" ? (
                <>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div
                        className="flex-1"
                        onClick={() => handleViewNote(note._id)}
                      >
                        <CardTitle className="text-lg line-clamp-2">
                          {note.title}
                        </CardTitle>
                        <CardDescription className="mt-2 line-clamp-2">
                          {note.description}
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-2 ml-2">
                        <Badge variant="outline">{note.subject}</Badge>
                        {user?._id === note.author && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                disabled={deleteLoading === note._id}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Note</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{note.title}
                                  "? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleDeleteNote(note._id, note.title)
                                  }
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                      <span className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {note.authorName || "Unknown"}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {note.readTime} min read
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-medium">
                          {note.rating || 0}
                        </span>
                        <span className="text-sm text-gray-500">
                          ({note.reviews || 0})
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewNote(note._id)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </>
              ) : (
                <div className="flex w-full">
                  <CardContent className="flex-1 p-6">
                    <div className="flex items-start justify-between">
                      <div
                        className="flex-1"
                        onClick={() => handleViewNote(note._id)}
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {note.title}
                          </h3>
                          <Badge variant="outline">{note.subject}</Badge>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                          {note.description}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            {note.authorName || "Unknown"}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {note.readTime} min read
                          </span>
                          <span className="flex items-center">
                            <Star className="w-4 h-4 mr-1 text-yellow-500" />
                            {note.rating || 0} ({note.reviews || 0})
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewNote(note._id)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4" />
                        </Button>
                        {user?._id === note.author && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                disabled={deleteLoading === note._id}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Note</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{note.title}
                                  "? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleDeleteNote(note._id, note.title)
                                  }
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Upgrade Prompt for Freemium Users */}
      {user?.plan === "freemium" && (
        <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="w-5 h-5 mr-2" />
              Unlock Premium Notes
            </CardTitle>
            <CardDescription className="text-purple-100">
              Upgrade to Premium to upload your own notes and access exclusive
              content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => navigate("/upgrade")}
              className="bg-white text-purple-600 hover:bg-gray-100"
            >
              Upgrade to Premium
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
