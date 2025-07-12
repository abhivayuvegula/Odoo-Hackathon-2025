import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RichTextEditor } from "@/components/RichTextEditor";
import { 
  ChevronUp, 
  ChevronDown, 
  Check, 
  ArrowLeft, 
  MessageSquare,
  Calendar,
  User
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Answer {
  id: number;
  content: string;
  author: string;
  votes: number;
  timeAgo: string;
  isAccepted?: boolean;
}

interface QuestionData {
  id: number;
  title: string;
  description: string;
  tags: string[];
  author: string;
  votes: number;
  timeAgo: string;
  answers: Answer[];
}

const mockQuestion: QuestionData = {
  id: 1,
  title: "How to join 2 columns in a data set to make a separate column in SQL",
  description: `<p>I do not know the code for it as I am a beginner. As an example what I need to do is like there is a column 1 containing First name and column 2 consists of last name I want a column to combine them both.</p>
  
  <p><strong>Example:</strong></p>
  <p>Column 1: John, Jane, Bob<br>
  Column 2: Doe, Smith, Johnson</p>
  
  <p><strong>Desired Result:</strong></p>
  <p>Full Name: John Doe, Jane Smith, Bob Johnson</p>`,
  tags: ["SQL", "Database"],
  author: "Trustworthy Magpie",
  votes: 5,
  timeAgo: "5 hours ago",
  answers: [
    {
      id: 1,
      content: `<p>You can use the <strong>|| operator</strong> or <strong>CONCAT function</strong> to combine columns in SQL:</p>
      
      <p><strong>Method 1: Using || operator (SQLite, PostgreSQL)</strong></p>
      <pre><code>SELECT 
  column1 || ' ' || column2 AS full_name
FROM your_table;</code></pre>

      <p><strong>Method 2: Using CONCAT function (MySQL, SQL Server)</strong></p>
      <pre><code>SELECT 
  CONCAT(column1, ' ', column2) AS full_name
FROM your_table;</code></pre>`,
      author: "Handsome Lion",
      votes: 8,
      timeAgo: "3 hours ago",
      isAccepted: true
    },
    {
      id: 2,
      content: `<p>Another approach is to use the <strong>CONCAT_WS</strong> function which handles NULL values better:</p>
      
      <pre><code>SELECT 
  CONCAT_WS(' ', first_name, last_name) AS full_name
FROM users;</code></pre>
      
      <p>The CONCAT_WS function will ignore NULL values and won't add the separator if one of the values is NULL.</p>`,
      author: "Worthy Wolf",
      votes: 3,
      timeAgo: "2 hours ago"
    }
  ]
};

export function QuestionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [question] = useState<QuestionData>(mockQuestion);
  const [answers, setAnswers] = useState<Answer[]>(question.answers);
  const [newAnswer, setNewAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVote = (type: 'up' | 'down', answerId?: number) => {
    toast({
      title: "Vote Recorded",
      description: `Your ${type}vote has been recorded.`,
    });
  };

  const handleAcceptAnswer = (answerId: number) => {
    setAnswers(prev => prev.map(answer => ({
      ...answer,
      isAccepted: answer.id === answerId ? !answer.isAccepted : false
    })));
    
    toast({
      title: "Answer Accepted",
      description: "This answer has been marked as accepted.",
    });
  };

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newAnswer.trim()) {
      toast({
        title: "Answer Required",
        description: "Please provide an answer before submitting.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const answer: Answer = {
        id: answers.length + 1,
        content: newAnswer,
        author: "Current User",
        votes: 0,
        timeAgo: "just now"
      };

      setAnswers(prev => [...prev, answer]);
      setNewAnswer("");
      
      toast({
        title: "Answer Posted!",
        description: "Your answer has been successfully posted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post answer. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => navigate("/")} className="p-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            {question.title}
          </h1>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <span>Question</span>
        <span>›</span>
        <span className="truncate">{question.title}</span>
      </div>

      {/* Question Card */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex gap-4">
            {/* Voting Section */}
            <div className="flex flex-col items-center space-y-2 min-w-[60px]">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0"
                onClick={() => handleVote('up')}
              >
                <ChevronUp className="h-6 w-6" />
              </Button>
              <span className="font-bold text-xl">{question.votes}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0"
                onClick={() => handleVote('down')}
              >
                <ChevronDown className="h-6 w-6" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1">
              <div 
                className="prose prose-sm max-w-none mb-4"
                dangerouslySetInnerHTML={{ __html: question.description }}
              />

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {question.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>asked {question.timeAgo}</span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <Badge variant="outline" className="text-primary border-primary">
                    {question.author}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Answers Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          {answers.length} Answer{answers.length !== 1 ? 's' : ''}
        </h2>

        <div className="space-y-6">
          {answers.map((answer) => (
            <Card key={answer.id} className={answer.isAccepted ? "border-success" : ""}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  {/* Voting Section */}
                  <div className="flex flex-col items-center space-y-2 min-w-[60px]">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => handleVote('up', answer.id)}
                    >
                      <ChevronUp className="h-6 w-6" />
                    </Button>
                    <span className="font-bold text-lg">{answer.votes}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => handleVote('down', answer.id)}
                    >
                      <ChevronDown className="h-6 w-6" />
                    </Button>
                    
                    {/* Accept Answer Button */}
                    <Button
                      variant={answer.isAccepted ? "default" : "outline"}
                      size="sm"
                      className="h-8 w-8 p-0 mt-2"
                      onClick={() => handleAcceptAnswer(answer.id)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    {answer.isAccepted && (
                      <Badge className="bg-success text-success-foreground mb-3">
                        ✓ Accepted Answer
                      </Badge>
                    )}
                    
                    <div 
                      className="prose prose-sm max-w-none mb-4"
                      dangerouslySetInnerHTML={{ __html: answer.content }}
                    />

                    {/* Author Info */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>answered {answer.timeAgo}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <Badge variant="outline" className="text-primary border-primary">
                          {answer.author}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Separator className="my-8" />

      {/* Submit Answer */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Submit Your Answer</h3>
          <form onSubmit={handleSubmitAnswer}>
            <RichTextEditor
              value={newAnswer}
              onChange={setNewAnswer}
              placeholder="Write your answer here..."
              className="mb-4"
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Posting..." : "Post Your Answer"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}