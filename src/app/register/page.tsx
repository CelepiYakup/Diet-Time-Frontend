"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.scss";
import { userApi } from "../services/api";
import { useToast } from "../context/ToastContext";
import {
  registerSchema,
  RegisterInput,
} from "../lib/validation/register/register.schema";
import Input from "../ui/input/input";

export default function Register() {
  const router = useRouter();
  const { showSuccess, showError } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    trigger,
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    mode: "onSubmit",
  });

  const onSubmit = async (data: RegisterInput) => {
    try {
      await userApi.registerUser(data);
      showSuccess("Account created successfully! Please log in.");
      router.push("/login");
    } catch (error) {
      if (error instanceof Error) {
        showError(error.message);
      } else {
        showError("An unexpected error occurred");
      }
    }
  };

  return (
    <div className={styles.registerPage}>
      <div className={styles.registerContainer}>
        <div className={styles.registerCard}>
          <h1 className={styles.title}>Create Account</h1>
          <p className={styles.subtitle}>
            Join Diet Time to track your nutrition
          </p>

          <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.formGroup}>
              <label htmlFor="username" className={styles.label}>
                Username
              </label>
              <Input
                name="username"
                label="Username"
                type="username"
                placeholder="Choose a username"
                register={register}
                error={errors.username}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                Email
              </label>
              <Input
                name="email"
                type="email"
                placeholder="Enter your email"
                register={register}
                error={errors.email}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <Input
                name="password"
                type="password"
                placeholder="Enter your password"
                register={register}
                error={errors.password}
              />

            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className={styles.loadingSpinner}></span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className={styles.footer}>
            <p>
              Already have an account?{" "}
              <Link href="/login" className={styles.link}>
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
