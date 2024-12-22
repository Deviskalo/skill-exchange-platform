"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { redirect } from "next/navigation";

import {
  getAuth,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import {
  doc,
  getFirestore,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  DocumentData,
} from "firebase/firestore";

import { useState, useEffect } from "react";
import { app } from "@/lib/firebase"; // Adjust import path as needed

// Define interfaces for type safety
interface Skill {
  id: string;
  name: string;
  proficiency?: number;
}

interface SkillExchange {
  id: string;
  partnerName: string;
  skill: string;
  date: string;
  status: "Pending" | "Confirmed" | "Cancelled";
}

export default function DashboardPage() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [exchanges, setExchanges] = useState<SkillExchange[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth(app);
    const db = getFirestore(app);

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          setUser(currentUser);

          // Fetch user skills
          const skillsQuery = query(
            collection(db, "skills"),
            where("userId", "==", currentUser.uid)
          );
          const skillsSnapshot = await getDocs(skillsQuery);
          setSkills(
            skillsSnapshot.docs.map(
              (doc) =>
                ({
                  id: doc.id,
                  ...doc.data(),
                } as Skill)
            )
          );

          // Fetch skill exchanges
          const exchangesQuery = query(
            collection(db, "exchanges"),
            where("userId", "==", currentUser.uid)
          );
          const exchangesSnapshot = await getDocs(exchangesQuery);
          setExchanges(
            exchangesSnapshot.docs.map(
              (doc) =>
                ({
                  id: doc.id,
                  ...doc.data(),
                } as SkillExchange)
            )
          );
        } catch (error) {
          console.error("Error fetching dashboard data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        // Redirect to login if no user is authenticated
        redirect("/login");
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="container mx-auto p-6">Loading...</div>;
  }

  if (!user) {
    return null; // Redirect handled in useEffect
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Profile Card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Profile Overview</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <Avatar className="w-24 h-24 mb-4">
              <AvatarImage
                src={user.photoURL || "/default-avatar.png"}
                alt={user.displayName || "User Profile"}
              />
              <AvatarFallback>
                {user.displayName?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold">{user.displayName}</h2>
            <p className="text-muted-foreground">{user.email}</p>

            <div className="mt-4 w-full space-y-2">
              <div className="flex justify-between">
                <span>Skills Learned</span>
                <Badge variant="secondary">{skills.length}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Skill Exchanges</span>
                <Badge variant="secondary">{exchanges.length}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skills Overview */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>My Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Skill</TableHead>
                  <TableHead>Proficiency</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {skills.map((skill) => (
                  <TableRow key={skill.id}>
                    <TableCell>{skill.name}</TableCell>
                    <TableCell>
                      <Progress value={skill.proficiency || 0} />
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Exchanges */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Skill Exchanges</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Partner</TableHead>
                <TableHead>Skill</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exchanges.map((exchange) => (
                <TableRow key={exchange.id}>
                  <TableCell>{exchange.partnerName}</TableCell>
                  <TableCell>{exchange.skill}</TableCell>
                  <TableCell>{exchange.date}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        exchange.status === "Confirmed"
                          ? "default"
                          : exchange.status === "Pending"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {exchange.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex space-x-4">
          <Link href="/skills/learn">
            <Button>Find a Skill to Learn</Button>
          </Link>
          <Link href="/skills/teach">
            <Button variant="secondary">Offer a Skill</Button>
          </Link>
          <Link href="/profile">
            <Button variant="outline">Edit Profile</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
