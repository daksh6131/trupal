"use client";

import { useAuth } from "@/contexts/auth-context";
import ProtectedRoute from "@/components/protected-route";
import { ArrowLeft, Phone, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
export default function ProfilePage() {
  const {
    authState,
    signOut
  } = useAuth();
  const router = useRouter();
  return <ProtectedRoute>
      <div className="min-h-screen bg-gray-50" data-unique-id="35aa39bc-9b87-4462-9957-2814f18662cd" data-loc="14:6-14:47" data-file-name="app/profile/page.tsx">
        <header className="bg-white shadow" data-unique-id="e4725ccb-56f3-4437-848e-1d68bf81b9d9" data-loc="15:8-15:44" data-file-name="app/profile/page.tsx">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6" data-unique-id="03561ceb-e174-4f20-bfe4-cba54e7a5a86" data-loc="16:10-16:63" data-file-name="app/profile/page.tsx">
            <div className="flex items-center justify-between" data-unique-id="2338d6e2-c62e-4594-8df4-8844e7ffd977" data-loc="17:12-17:63" data-file-name="app/profile/page.tsx">
              <div className="flex items-center" data-unique-id="93f5487e-78b8-4bfe-98b3-6cc84ce1f3a0" data-loc="18:14-18:49" data-file-name="app/profile/page.tsx">
                <button onClick={() => router.push("/dashboard")} className="mr-4 p-1 rounded-full hover:bg-gray-100" data-unique-id="b8cb7f0a-0181-461b-bb85-288a3fb81d1c" data-loc="19:16-19:118" data-file-name="app/profile/page.tsx">
                  <ArrowLeft className="h-5 w-5 text-gray-600" />
                </button>
                <h1 className="text-xl font-bold text-gray-900" data-unique-id="f5a2c1cf-29ef-46f1-94fd-2ae50a7e5bdc" data-loc="22:16-22:64" data-file-name="app/profile/page.tsx">My Profile</h1>
              </div>
              <button onClick={signOut} className="flex items-center text-sm font-medium text-red-600 hover:text-red-800" data-unique-id="1cbb8fa0-4f63-4ec4-8114-937f5c2e39b8" data-loc="24:14-24:122" data-file-name="app/profile/page.tsx">
                <LogOut className="h-4 w-4 mr-1" /> Sign Out
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 py-8 sm:px-6" data-unique-id="995e0817-9d3e-4ae2-aaf5-a1af40cf7411" data-loc="31:8-31:62" data-file-name="app/profile/page.tsx">
          <div className="bg-white shadow rounded-lg overflow-hidden" data-unique-id="010d2da8-bf56-4a2e-8227-220fed6963e8" data-loc="32:10-32:70" data-file-name="app/profile/page.tsx">
            <div className="px-4 py-5 sm:p-6" data-unique-id="0d3cac2f-9860-46e4-950c-5e557a340501" data-loc="33:12-33:46" data-file-name="app/profile/page.tsx">
              <div className="space-y-6" data-unique-id="93025bca-0808-4f87-a753-c12d6a9faca7" data-loc="34:14-34:41" data-file-name="app/profile/page.tsx">
                <div data-unique-id="dc60c9c4-1b21-4def-818c-589ae2f9ca29" data-loc="35:16-35:21" data-file-name="app/profile/page.tsx">
                  <h3 className="text-lg font-medium text-gray-900" data-unique-id="30de2469-dbba-43fe-9765-515b45e4d8c0" data-loc="36:18-36:68" data-file-name="app/profile/page.tsx">Account Information</h3>
                  <p className="mt-1 text-sm text-gray-500" data-unique-id="55f17d18-f94e-4cd9-a962-8ddb93ca0769" data-loc="37:18-37:60" data-file-name="app/profile/page.tsx">
                    Your account details and preferences.
                  </p>
                </div>

                <div className="border-t border-gray-200 pt-6" data-unique-id="81dd05b7-0a4d-4e3e-bba3-364ac7e23cf1" data-loc="42:16-42:63" data-file-name="app/profile/page.tsx">
                  <dl className="divide-y divide-gray-200" data-unique-id="8557c768-e1f9-44b4-bdda-9c65702e7be2" data-loc="43:18-43:59" data-file-name="app/profile/page.tsx">
                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4" data-unique-id="8b74d4b3-157d-4980-b98e-33ebe9c1e0dd" data-loc="44:20-44:74" data-file-name="app/profile/page.tsx">
                      <dt className="text-sm font-medium text-gray-500" data-unique-id="928aa7a4-ff1e-4fef-8a47-86614c6aa7af" data-loc="45:22-45:72" data-file-name="app/profile/page.tsx">User ID</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2" data-unique-id="ebde6334-c803-425a-a4f2-a7005298ccaf" data-loc="46:22-46:87" data-file-name="app/profile/page.tsx">
                        {authState.user?.id}
                      </dd>
                    </div>

                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4" data-unique-id="58e7e421-a042-4a87-b159-fc099400d73a" data-loc="51:20-51:74" data-file-name="app/profile/page.tsx">
                      <dt className="text-sm font-medium text-gray-500" data-unique-id="8676036d-1ee3-48f1-8283-135537894f2d" data-loc="52:22-52:72" data-file-name="app/profile/page.tsx">Phone Number</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center" data-unique-id="e4268914-439e-4059-8813-28dce1b97b87" data-loc="53:22-53:105" data-file-name="app/profile/page.tsx">
                        <Phone className="h-4 w-4 text-gray-400 mr-2" />
                        {authState.user?.phone}
                      </dd>
                    </div>

                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4" data-unique-id="65a3c036-73cd-4b84-8f54-ab8d1bd91daf" data-loc="59:20-59:74" data-file-name="app/profile/page.tsx">
                      <dt className="text-sm font-medium text-gray-500" data-unique-id="2c3f3cba-dc2e-49e6-9dc6-2e9885d71873" data-loc="60:22-60:72" data-file-name="app/profile/page.tsx">Role</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2" data-unique-id="4ae0ca61-b02f-4da0-bf75-0961e31e14da" data-loc="61:22-61:87" data-file-name="app/profile/page.tsx">
                        {authState.user?.role || "User"}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>;
}