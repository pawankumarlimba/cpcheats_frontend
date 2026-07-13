import AddNewInterview from "./(componets)/add-new-interview"
import InterviewList from "./(componets)/interview-list"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, ClipboardList, ArrowRight } from "lucide-react"

const Dashboard = () => {
  return (
    <div className="container-fluid pt-[100px] pb-[50px]">
      <div className="mb-8 space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">AI Interview Dashboard</h1>
        <p className="text-muted-foreground max-w-2xl">
          Create new interview sessions or continue with your previous interviews
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Quick Actions Card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlusCircle className="h-5 w-5 text-primary" />
              Quick Actions
            </CardTitle>
            <CardDescription>Start a new interview session</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Create a new AI mock interview tailored to your job position and experience level.
              </p>
              <AddNewInterview />
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2">
        <Card className="bg-muted/30 md:col-span-3">
          <CardHeader>
            <CardTitle>Getting Started with AI Interviews</CardTitle>
            <CardDescription>Follow these steps to make the most of your interview practice</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center p-4">
                <div className="bg-primary/10 rounded-full p-3 mb-4">
                  <PlusCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium mb-2">1. Create an Interview</h3>
                <p className="text-sm text-muted-foreground">
                  Set up a new interview with your job details and experience level
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-4">
                <div className="bg-primary/10 rounded-full p-3 mb-4">
                  <ArrowRight className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium mb-2">2. Complete the Session</h3>
                <p className="text-sm text-muted-foreground">
                  Answer questions from our AI interviewer to practice your skills
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-4">
                <div className="bg-primary/10 rounded-full p-3 mb-4">
                  <ClipboardList className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium mb-2">3. Review Feedback</h3>
                <p className="text-sm text-muted-foreground">
                  Get detailed feedback and suggestions to improve your interview skills
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>

      {/* Interview List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-primary" />
              Previous Interviews
            </CardTitle>
            <CardDescription>Resume or review your previous interview sessions</CardDescription>
          </div>
          <div className="hidden sm:flex">
          <AddNewInterview />
          </div>
        </CardHeader>
        <CardContent>
          <InterviewList />
        </CardContent>
      </Card>

      {/* Getting Started Guide */}
    
    </div>
  )
}

export default Dashboard

