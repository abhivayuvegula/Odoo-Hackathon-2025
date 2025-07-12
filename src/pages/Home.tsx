import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronUp, ChevronDown, MessageSquare, Plus } from "lucide-react";

interface Question {
  id: number;
  title: string;
  description: string;
  tags: string[];
  author: string;
  votes: number;
  answers: number;
  timeAgo: string;
  hasAcceptedAnswer?: boolean;
}

const mockQuestions: Question[] = [
  {
    id: 1,
    title: "How to join 2 columns in a data set to make a separate column in SQL",
    description: "I do not know the code for it as I am a beginner. As an example what I need to do is like there is a column 1 containing First name and column 2 consists of last name I want a column to combine...",
    tags: ["SQL", "Database"],
    author: "Trustworthy Magpie",
    votes: 5,
    answers: 3,
    timeAgo: "5 ans",
    hasAcceptedAnswer: true
  },
  {
    id: 2,
    title: "React useEffect cleanup function not working",
    description: "I'm having trouble with my useEffect cleanup function. It doesn't seem to be running when the component unmounts...",
    tags: ["React", "JavaScript"],
    author: "Handsome Lion",
    votes: 8,
    answers: 2,
    timeAgo: "3 ans"
  },
  {
    id: 3,
    title: "TypeError: Cannot read property of undefined",
    description: "Getting this error when trying to access nested object properties. How can I safely access them?",
    tags: ["JavaScript", "Error"],
    author: "Worthy Wolf",
    votes: 2,
    answers: 4,
    timeAgo: "2 ans"
  }
];

export function Home() {
  const [searchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState("newest");
  const [filterBy, setFilterBy] = useState("all");
  const searchQuery = searchParams.get("search") || "";

  const filteredQuestions = mockQuestions.filter(question => {
    if (searchQuery) {
      return question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
             question.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
             question.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">All Questions</h1>
          <p className="text-muted-foreground">
            {searchQuery ? `Search results for "${searchQuery}"` : "Browse the latest questions from our community"}
          </p>
        </div>
        <Link to="/ask">
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Ask New Question
          </Button>
        </Link>
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex gap-2">
          <Select value={filterBy} onValueChange={setFilterBy}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Filters" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="unanswered">Unanswered</SelectItem>
              <SelectItem value="answered">Answered</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="votes">Most Votes</SelectItem>
              <SelectItem value="answers">Most Answers</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.map((question) => (
          <Card key={question.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex gap-4">
                {/* Voting Section */}
                <div className="flex flex-col items-center space-y-2 min-w-[60px]">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <ChevronUp className="h-5 w-5" />
                  </Button>
                  <span className="font-semibold text-lg">{question.votes}</span>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <ChevronDown className="h-5 w-5" />
                  </Button>
                </div>

                {/* Content Section */}
                <div className="flex-1">
                  <Link 
                    to={`/question/${question.id}`}
                    className="block group"
                  >
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                      {question.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                      {question.description}
                    </p>
                  </Link>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {question.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="hover:bg-accent">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Meta Information */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{question.answers} answers</span>
                        {question.hasAcceptedAnswer && (
                          <Badge variant="outline" className="text-success border-success ml-2">
                            ✓ Accepted
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>asked {question.timeAgo} by</span>
                      <Badge variant="outline" className="text-primary border-primary">
                        {question.author}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8">
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5, 6, 7].map((page) => (
            <Button
              key={page}
              variant={page === 1 ? "default" : "outline"}
              size="sm"
              className="h-8 w-8 p-0"
            >
              {page}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}