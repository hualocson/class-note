"use client";

import { useRouter } from "next/navigation";

import { BookOpen, Calendar, DollarSign, Filter, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

import PageHeader from "@/components/common/PageHeader";

import ClassesListing from "./ClassesListing";

const MainClassesPage = () => {
  const router = useRouter();
  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Reusable Header */}
      <PageHeader
        title="Classes"
        icon={<BookOpen className="text-primary h-6 w-6" />}
        onBack={() => router.push("/")}
      >
        {/* <AddClassDrawer /> */}
      </PageHeader>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-6 pb-24">
        {/* Stats Overview */}
        <section className="mb-6">
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="text-muted-foreground h-4 w-4" />
                  <div>
                    <p className="text-2xl font-bold">0</p>
                    <p className="text-muted-foreground text-xs">
                      Total Classes
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="text-muted-foreground h-4 w-4" />
                  <div>
                    <p className="text-2xl font-bold">₫0</p>
                    <p className="text-muted-foreground text-xs">Total Spent</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Calendar className="text-muted-foreground h-4 w-4" />
                  <div>
                    <p className="text-2xl font-bold">₫0</p>
                    <p className="text-muted-foreground text-xs">This Month</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Search and Filters */}
        <section className="mb-6">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input placeholder="Search classes..." className="pl-10" />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>All Classes</DropdownMenuItem>
                <DropdownMenuItem>Active Classes</DropdownMenuItem>
                <DropdownMenuItem>Completed Classes</DropdownMenuItem>
                <DropdownMenuItem>By Price: High to Low</DropdownMenuItem>
                <DropdownMenuItem>By Price: Low to High</DropdownMenuItem>
                <DropdownMenuItem>By Date: Newest</DropdownMenuItem>
                <DropdownMenuItem>By Date: Oldest</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </section>

        {/* Classes List */}
        <section>
          <ClassesListing />
        </section>
      </main>
    </div>
  );
};

export default MainClassesPage;
