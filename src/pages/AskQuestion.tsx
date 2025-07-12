import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RichTextEditor } from "@/components/RichTextEditor";
import { TagInput } from "@/components/TagInput";
import { ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export function AskQuestion() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a title for your question.",
        variant: "destructive"
      });
      return;
    }

    if (!description.trim()) {
      toast({
        title: "Description Required", 
        description: "Please provide a description for your question.",
        variant: "destructive"
      });
      return;
    }

    if (tags.length === 0) {
      toast({
        title: "Tags Required",
        description: "Please add at least one tag to your question.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Question Posted!",
        description: "Your question has been successfully posted.",
      });
      
      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post question. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={() => navigate("/")} className="p-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Ask a Question</h1>
          <p className="text-muted-foreground mt-1">
            Share your knowledge by asking a clear, specific question
          </p>
        </div>
      </div>

      {/* Form */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Question Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-base font-medium">
                Title *
              </Label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Be specific and imagine you're asking a question to another person"
                className="text-base"
                maxLength={150}
              />
              <p className="text-sm text-muted-foreground">
                {title.length}/150 characters
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label className="text-base font-medium">
                Description *
              </Label>
              <RichTextEditor
                value={description}
                onChange={setDescription}
                placeholder="Provide all the details someone would need to answer your question..."
                className="min-h-[200px]"
              />
              <p className="text-sm text-muted-foreground">
                Include what you expect to happen, what actually happened, and the minimum code that reproduces the problem.
              </p>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label className="text-base font-medium">
                Tags *
              </Label>
              <TagInput
                tags={tags}
                onTagsChange={setTags}
                placeholder="Add up to 5 tags to describe what your question is about"
              />
              <p className="text-sm text-muted-foreground">
                Add tags to help others find and answer your question. Use existing tags when possible.
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="px-8"
              >
                {isSubmitting ? "Posting..." : "Post Your Question"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="mt-6 bg-accent/50">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-3">Tips for asking a great question:</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Make sure your question title is specific and clear</li>
            <li>• Include relevant code, configuration, or error messages</li>
            <li>• Explain what you've already tried to solve the problem</li>
            <li>• Use proper formatting to make your question easy to read</li>
            <li>• Add appropriate tags to help others find your question</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}