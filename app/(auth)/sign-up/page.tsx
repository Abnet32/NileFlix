"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { authClient } from "@/lib/auth-client";

type SignUpState = {
	name: string;
	email: string;
	password: string;
	image: string;
};

const initialState: SignUpState = {
	name: "",
	email: "",
	password: "",
	image: "",
};

export default function SignUpPage() {
	const router = useRouter();
	const [form, setForm] = useState<SignUpState>(initialState);
	const [loading, setLoading] = useState(false);
	const [socialLoading, setSocialLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setErrorMessage(null);

		if (!form.name.trim()) {
			setErrorMessage("Please enter your full name.");
			return;
		}

		if (!form.email.trim()) {
			setErrorMessage("Please enter your email address.");
			return;
		}

		if (form.password.length < 8) {
			setErrorMessage("Password must be at least 8 characters long.");
			return;
		}

		await authClient.signUp.email(
			{
				name: form.name.trim(),
				email: form.email.trim(),
				password: form.password,
				image: form.image.trim() || undefined,
				callbackURL: "/",
			},
			{
				onRequest: () => {
					setLoading(true);
				},
				onSuccess: () => {
					setLoading(false);
					router.push("/");
				},
				onError: (ctx) => {
					setLoading(false);
					setErrorMessage(ctx.error.message || "Unable to create account.");
				},
			},
		);
	};

	const signInWithGoogle = async () => {
		setErrorMessage(null);
		setSocialLoading(true);

		await authClient.signIn.social(
			{
				provider: "google",
				callbackURL: "/",
			},
			{
				onError: (ctx) => {
					setSocialLoading(false);
					setErrorMessage(ctx.error.message || "Google sign-in failed.");
				},
			},
		);
	};

	return (
		<main className="auth-shell">
			<section className="auth-card auth-pop">
				<p className="auth-eyebrow">New Account</p>
				<h1 className="auth-title">Join NileFlix</h1>
				<p className="auth-subtitle">
					Create your profile and start streaming instantly.
				</p>

				<button
					type="button"
					onClick={signInWithGoogle}
					disabled={socialLoading || loading}
					className="auth-social"
				>
					{socialLoading ? "Connecting..." : "Continue with Google"}
				</button>

				<div className="auth-divider" aria-hidden>
					<span>or use email</span>
				</div>

				<form onSubmit={onSubmit} className="auth-form">
					<label className="auth-label" htmlFor="name">
						Full name
					</label>
					<input
						id="name"
						type="text"
						autoComplete="name"
						value={form.name}
						onChange={(event) =>
							setForm((current) => ({ ...current, name: event.target.value }))
						}
						className="auth-input"
						placeholder="Ada Lovelace"
						required
					/>

					<label className="auth-label" htmlFor="email">
						Email
					</label>
					<input
						id="email"
						type="email"
						autoComplete="email"
						value={form.email}
						onChange={(event) =>
							setForm((current) => ({ ...current, email: event.target.value }))
						}
						className="auth-input"
						placeholder="you@example.com"
						required
					/>

					<label className="auth-label" htmlFor="password">
						Password
					</label>
					<input
						id="password"
						type="password"
						autoComplete="new-password"
						value={form.password}
						onChange={(event) =>
							setForm((current) => ({ ...current, password: event.target.value }))
						}
						className="auth-input"
						placeholder="Minimum 8 characters"
						minLength={8}
						required
					/>

					<label className="auth-label" htmlFor="image">
						Avatar URL (optional)
					</label>
					<input
						id="image"
						type="url"
						autoComplete="url"
						value={form.image}
						onChange={(event) =>
							setForm((current) => ({ ...current, image: event.target.value }))
						}
						className="auth-input"
						placeholder="https://example.com/avatar.png"
					/>

					{errorMessage ? (
						<p className="auth-error" role="alert">
							{errorMessage}
						</p>
					) : null}

					<button type="submit" className="auth-submit" disabled={loading || socialLoading}>
						{loading ? "Creating account..." : "Create account"}
					</button>
				</form>

				<p className="auth-footnote">
					Already have an account? <Link href="/sign-in">Sign in</Link>
				</p>
			</section>
		</main>
	);
}
