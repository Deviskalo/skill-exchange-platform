"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider, githubProvider } from "@/lib/firebase";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  skills: z.array(z.string()).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [githubProvider, setGithubProvider] = useState(null);
  const [googleProvider, setGoogleProvider] = useState(null);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      bio: "",
      skills: [],
    },
  });

  const handleAddSkill = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && skillInput) {
      e.preventDefault();
      if (!skills.includes(skillInput)) {
        const newSkills = [...skills, skillInput];
        setSkills(newSkills);
        form.setValue("skills", newSkills);
      }
      setSkillInput("");
    }
  };

  const onSubmit = async (data: SignupFormValues) => {
    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        data.email, 
        data.password
      );
      const user = userCredential.user;

      // Add additional user details to Firestore
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        email: data.email,
        name: data.name,
        bio: data.bio || "",
        skills: data.skills || [],
        createdAt: new Date()
      });

      router.push("/");
    } catch (error: any) {
      setError(error.message);
      console.error(error);
    }
  };

  const handleSocialSignUp = async (provider: any) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        bio: "",
        skills: [],
        createdAt: new Date()
      });
      router.push("/");
    } catch (error: any) {
      setError(error.message);
      console.error(error);
    }
  };
  return (
    <div className="max-w-md mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold mb-8">Create Account</h1>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="you@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="******" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="******" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us a bit about yourself..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <FormLabel>Skills</FormLabel>
            <Input
              placeholder="Add skills... (Press Enter)"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleAddSkill}
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {skills.map((skill) => (
                <div 
                  key={skill} 
                  className="bg-secondary text-secondary-foreground rounded-md px-2 py-1 text-sm flex items-center"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => {
                      const newSkills = skills.filter((s) => s !== skill);
                      setSkills(newSkills);
                      form.setValue("skills", newSkills);
                    }}
                    className="ml-2 hover:text-destructive"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="text-destructive text-sm">{error}</div>
          )}

          <Button type="submit" className="w-full">
            Create Account
          </Button>
        </form>
      </Form>

      <div className="text-center mt-4">
        <Link 
          href="/login" 
          className="text-sm text-muted-foreground hover:underline"
        >
          Already have an account? Sign in
        </Link>
      </div>
      <div className="relative my-4 flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or Register with
          </span>
    </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <Button 
          variant="outline" 
          onClick={() => handleSocialSignUp(googleProvider)}
          className="w-full"
        >
          <FcGoogle className="mr-2 h-4 w-4" />
          Google
        </Button>
        <Button 
          variant="outline" 
          onClick={() => handleSocialSignUp(githubProvider)}
          className="w-full"
        >
          <FaGithub className="mr-2 h-4 w-4" />
          GitHub
        </Button>
      </div>
    </div>
  );
}