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
      <div className="min-h-screen bg-gray-50" data-unique-id="8d5d4789-7565-435c-94ff-75c2196435ba" data-loc="14:6-14:47" data-file-name="app/profile/page.tsx">
        <header className="bg-white shadow" data-unique-id="1455463e-34da-492a-ba6f-f0651ee48142" data-loc="15:8-15:44" data-file-name="app/profile/page.tsx">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6" data-unique-id="226036f4-29cb-4efd-a1d8-9facf4f2bc33" data-loc="16:10-16:63" data-file-name="app/profile/page.tsx">
            <div className="flex items-center justify-between" data-unique-id="5642f270-d43e-46ba-86d7-3b08b1714205" data-loc="17:12-17:63" data-file-name="app/profile/page.tsx">
              <div className="flex items-center" data-unique-id="eea2302d-911d-44ad-b434-5ad7e717c4cb" data-loc="18:14-18:49" data-file-name="app/profile/page.tsx">
                <button onClick={() => router.push("/dashboard")} className="mr-4 p-1 rounded-full hover:bg-gray-100" data-unique-id="09e87f59-5be1-4cdf-9fe3-50292f440c54" data-loc="19:16-19:118" data-file-name="app/profile/page.tsx">
                  <ArrowLeft className="h-5 w-5 text-gray-600" />
                </button>
                <h1 className="text-xl font-bold text-gray-900" data-unique-id="780aa9a4-41aa-4dcc-85d6-17a8414e0366" data-loc="22:16-22:64" data-file-name="app/profile/page.tsx">My Profile</h1>
              </div>
              <button onClick={signOut} className="flex items-center text-sm font-medium text-red-600 hover:text-red-800" data-unique-id="b77aa46f-c221-4b7b-bafe-6a07dfdb05bf" data-loc="24:14-24:122" data-file-name="app/profile/page.tsx">
                <LogOut className="h-4 w-4 mr-1" /> Sign Out
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 py-8 sm:px-6" data-unique-id="6d4f2b29-9326-4c04-8633-4bcdf6ae12df" data-loc="31:8-31:62" data-file-name="app/profile/page.tsx">
          <div className="bg-white shadow rounded-lg overflow-hidden" data-unique-id="ecfa23c4-22b8-4f4e-80e5-c2f319f57c2a" data-loc="32:10-32:70" data-file-name="app/profile/page.tsx">
            <div className="px-4 py-5 sm:p-6" data-unique-id="21b5887e-fdf1-496c-90fd-4dfbdc1eec4a" data-loc="33:12-33:46" data-file-name="app/profile/page.tsx">
              <div className="space-y-6" data-unique-id="9fdb3dc8-cda9-43bf-bcb7-46dfb4ab474e" data-loc="34:14-34:41" data-file-name="app/profile/page.tsx">
                <div data-unique-id="e98e718f-9ae3-428b-822b-2881a7b66de1" data-loc="35:16-35:21" data-file-name="app/profile/page.tsx">
                  <h3 className="text-lg font-medium text-gray-900" data-unique-id="b5038699-aa7e-4ba6-b913-ff31dbbf731a" data-loc="36:18-36:68" data-file-name="app/profile/page.tsx">Account Information</h3>
                  <p className="mt-1 text-sm text-gray-500" data-unique-id="5ddc37a7-3589-4911-9ee7-20a8891256e3" data-loc="37:18-37:60" data-file-name="app/profile/page.tsx">
                    Your account details and preferences.
                  </p>
                </div>

                <div className="border-t border-gray-200 pt-6" data-unique-id="47495d5e-d29b-4248-97ab-2974e1554aa9" data-loc="42:16-42:63" data-file-name="app/profile/page.tsx">
                  <dl className="divide-y divide-gray-200" data-unique-id="24c9d487-2e9c-4d34-a8b6-f563673118c9" data-loc="43:18-43:59" data-file-name="app/profile/page.tsx">
                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4" data-unique-id="e5edb1e9-7ca3-46d9-9e79-7a49462fdb60" data-loc="44:20-44:74" data-file-name="app/profile/page.tsx">
                      <dt className="text-sm font-medium text-gray-500" data-unique-id="2c0d906b-e980-432a-9726-2847461c2800" data-loc="45:22-45:72" data-file-name="app/profile/page.tsx">User ID</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2" data-unique-id="c68faf43-386b-4ddd-977a-a77db2b01de0" data-loc="46:22-46:87" data-file-name="app/profile/page.tsx">
                        {authState.user?.id}
                      </dd>
                    </div>

                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4" data-unique-id="bb24b13c-d90f-4a4e-a27e-b6f81d07e759" data-loc="51:20-51:74" data-file-name="app/profile/page.tsx">
                      <dt className="text-sm font-medium text-gray-500" data-unique-id="645a0807-b288-4c31-b821-04b257641a13" data-loc="52:22-52:72" data-file-name="app/profile/page.tsx">Phone Number</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center" data-unique-id="4920de05-817a-43fc-b6ba-4071fe897c05" data-loc="53:22-53:105" data-file-name="app/profile/page.tsx">
                        <Phone className="h-4 w-4 text-gray-400 mr-2" />
                        {authState.user?.phone}
                      </dd>
                    </div>

                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4" data-unique-id="0d8bb67d-0206-40b0-9fde-bdc93db35f73" data-loc="59:20-59:74" data-file-name="app/profile/page.tsx">
                      <dt className="text-sm font-medium text-gray-500" data-unique-id="a7f2fbf9-2057-4526-ac32-3abbb8af8205" data-loc="60:22-60:72" data-file-name="app/profile/page.tsx">Role</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2" data-unique-id="8129a575-45d4-4697-8499-d5b8ad4ab219" data-loc="61:22-61:87" data-file-name="app/profile/page.tsx">
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