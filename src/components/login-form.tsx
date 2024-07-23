"use client";

import { loginAction } from "@/app/(auth)/_actions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginSchema } from "@/lib/schemas";
import type { Login } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { type FormEvent, useRef } from "react";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";

export function LoginForm() {
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction] = useFormState(loginAction, {
    message: null,
  });

  const form = useForm<Login>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    form.handleSubmit(() =>
      formAction(new FormData(formRef.current as HTMLFormElement)),
    )(event);
  }

  return (
    <div>
      {state.message ? (
        <p className="font-medium text-[0.8rem] text-destructive">
          {state.message}
        </p>
      ) : undefined}
      <Form {...form}>
        <form ref={formRef} className="space-y-3" onSubmit={handleSubmit}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
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
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full sm:w-auto" type="submit">
            Login
          </Button>
        </form>
      </Form>
    </div>
  );
}
