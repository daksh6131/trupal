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
      <div className="min-h-screen bg-gray-50" data-unique-id="e71c8c1f-870a-45eb-83b1-ece0b8048af2" data-loc="14:6-14:47" data-file-name="app/profile/page.tsx">
        <header className="bg-white shadow" data-unique-id="4c0b06d1-ee9a-4c6a-8a9a-60ac011ae5ae" data-loc="15:8-15:44" data-file-name="app/profile/page.tsx">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6" data-unique-id="28e3aabd-bdff-4a39-a7af-11e2d25dbb7f" data-loc="16:10-16:63" data-file-name="app/profile/page.tsx">
            <div className="flex items-center justify-between" data-unique-id="2a42a483-d211-4fe3-8330-06864e60d35c" data-loc="17:12-17:63" data-file-name="app/profile/page.tsx">
              <div className="flex items-center" data-unique-id="f4995199-4e58-4d14-ae96-f9f6be9e2bb7" data-loc="18:14-18:49" data-file-name="app/profile/page.tsx">
                <button onClick={() => router.push("/dashboard")} className="mr-4 p-1 rounded-full hover:bg-gray-100" data-unique-id="d8ef48a0-0967-497e-88b1-e2b4edf79a94" data-loc="19:16-19:118" data-file-name="app/profile/page.tsx">
                  <ArrowLeft className="h-5 w-5 text-gray-600" />
                </button>
                <h1 className="text-xl font-bold text-gray-900" data-unique-id="59121ee5-89ee-4f11-a694-ca1e348e16ae" data-loc="22:16-22:64" data-file-name="app/profile/page.tsx">My Profile</h1>
              </div>
              <button onClick={signOut} className="flex items-center text-sm font-medium text-red-600 hover:text-red-800" data-unique-id="dead9d5b-7c72-4717-a2e2-017c5b36dd4d" data-loc="24:14-24:122" data-file-name="app/profile/page.tsx">
                <LogOut className="h-4 w-4 mr-1" /> Sign Out
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 py-8 sm:px-6" data-unique-id="f8c89478-6b13-4919-92e1-3c4a6e761482" data-loc="31:8-31:62" data-file-name="app/profile/page.tsx">
          <div className="bg-white shadow rounded-lg overflow-hidden" data-unique-id="ef1d8c12-689f-4041-b1ef-43c2861d849d" data-loc="32:10-32:70" data-file-name="app/profile/page.tsx">
            <div className="px-4 py-5 sm:p-6" data-unique-id="8571485f-be8b-41fb-a692-37a9617acf7e" data-loc="33:12-33:46" data-file-name="app/profile/page.tsx">
              <div className="space-y-6" data-unique-id="90e92d5b-62aa-43c3-860e-cf8fbd168f36" data-loc="34:14-34:41" data-file-name="app/profile/page.tsx">
                <div data-unique-id="2b3ddc58-89f7-4166-9c28-4050a96bcf85" data-loc="35:16-35:21" data-file-name="app/profile/page.tsx">
                  <h3 className="text-lg font-medium text-gray-900" data-unique-id="66aaa694-1a4b-43f1-87bf-bbe4c1d64c43" data-loc="36:18-36:68" data-file-name="app/profile/page.tsx">Account Information</h3>
                  <p className="mt-1 text-sm text-gray-500" data-unique-id="04b1f474-866c-44aa-b6d6-8181ab820956" data-loc="37:18-37:60" data-file-name="app/profile/page.tsx">
                    Your account details and preferences.
                  </p>
                </div>

                <div className="border-t border-gray-200 pt-6" data-unique-id="68b3d669-5853-4572-a990-49605be4fdb0" data-loc="42:16-42:63" data-file-name="app/profile/page.tsx">
                  <dl className="divide-y divide-gray-200" data-unique-id="34cf5fa0-536a-41e2-8694-3e01ced19b89" data-loc="43:18-43:59" data-file-name="app/profile/page.tsx">
                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4" data-unique-id="15020fb0-c5eb-41f4-bcff-b5dbf4dfb0b6" data-loc="44:20-44:74" data-file-name="app/profile/page.tsx">
                      <dt className="text-sm font-medium text-gray-500" data-unique-id="ea44daed-7363-414e-9d73-661a14147da2" data-loc="45:22-45:72" data-file-name="app/profile/page.tsx">User ID</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2" data-unique-id="0b5c3604-603f-43b3-967f-dfeb18e5a2e9" data-loc="46:22-46:87" data-file-name="app/profile/page.tsx">
                        {authState.user?.id}
                      </dd>
                    </div>

                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4" data-unique-id="6c09657e-de7f-4ae0-bda8-ff03df797106" data-loc="51:20-51:74" data-file-name="app/profile/page.tsx">
                      <dt className="text-sm font-medium text-gray-500" data-unique-id="931dcb01-50a3-4746-91e6-9e54bf9608ab" data-loc="52:22-52:72" data-file-name="app/profile/page.tsx">Phone Number</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center" data-unique-id="793d3c95-673d-426a-aef3-1acdd2289a9d" data-loc="53:22-53:105" data-file-name="app/profile/page.tsx">
                        <Phone className="h-4 w-4 text-gray-400 mr-2" />
                        {authState.user?.phone}
                      </dd>
                    </div>

                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4" data-unique-id="e0fe591e-6842-4f58-88d5-c0c98f957350" data-loc="59:20-59:74" data-file-name="app/profile/page.tsx">
                      <dt className="text-sm font-medium text-gray-500" data-unique-id="bfdf604b-357c-4eec-a7ef-f4f8820f9f51" data-loc="60:22-60:72" data-file-name="app/profile/page.tsx">Role</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2" data-unique-id="1660c793-8680-45ed-80e3-66a6a80ed888" data-loc="61:22-61:87" data-file-name="app/profile/page.tsx">
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