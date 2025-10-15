import { Award, BookOpen, CheckCircle2, Clock } from "lucide-react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function Academy() {
  const courses = [
    {
      id: 1,
      title: "Property Valuation Fundamentals",
      description: "Learn the basics of property valuation and market analysis",
      duration: "2 hours",
      modules: 8,
      progress: 75,
      status: "in_progress",
    },
    {
      id: 2,
      title: "Tenant Screening Best Practices",
      description: "Master the art of screening and selecting quality tenants",
      duration: "1.5 hours",
      modules: 6,
      progress: 100,
      status: "completed",
    },
    {
      id: 3,
      title: "Real Estate Law and Compliance",
      description: "Understanding legal requirements and compliance in real estate",
      duration: "3 hours",
      modules: 10,
      progress: 0,
      status: "not_started",
    },
    {
      id: 4,
      title: "Marketing & Lead Generation",
      description: "Effective strategies for marketing properties and generating leads",
      duration: "2.5 hours",
      modules: 9,
      progress: 30,
      status: "in_progress",
    },
  ];

  const certifications = [
    {
      name: "Certified Property Agent",
      issueDate: "2025-01-15",
      expiryDate: "2026-01-15",
      status: "active",
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agent Academy</h1>
          <p className="text-muted-foreground">
            Enhance your skills and earn certifications
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Courses Completed</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">out of {courses.length} courses</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">active courses</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Certifications</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{certifications.length}</div>
              <p className="text-xs text-muted-foreground">active certifications</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">My Certifications</h2>
          <div className="grid gap-4">
            {certifications.map((cert, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-primary">
                        <Award className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div>
                        <CardTitle>{cert.name}</CardTitle>
                        <CardDescription className="mt-1">
                          Issued: {new Date(cert.issueDate).toLocaleDateString()}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className="bg-success">Active</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Expires: {new Date(cert.expiryDate).toLocaleDateString()}
                    </span>
                    <Button size="sm" variant="outline">
                      Download Certificate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Available Courses</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {courses.map((course) => (
              <Card key={course.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <CardDescription className="mt-2">
                        {course.description}
                      </CardDescription>
                    </div>
                    {course.status === "completed" && (
                      <CheckCircle2 className="h-5 w-5 text-success" />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      <span>{course.modules} modules</span>
                    </div>
                  </div>

                  {course.progress > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} />
                    </div>
                  )}

                  <Button
                    className="w-full bg-gradient-secondary"
                    variant={course.status === "completed" ? "outline" : "default"}
                  >
                    {course.status === "completed"
                      ? "Review Course"
                      : course.status === "in_progress"
                      ? "Continue Learning"
                      : "Start Course"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
