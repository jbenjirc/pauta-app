// src/app/(public)/registro/page.tsx
import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="flex-1 flex flex-col justify-center items-center p-4 font-sans w-full">
      <RegisterForm />
    </div>
  );
}
