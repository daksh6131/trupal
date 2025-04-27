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
      <div className="min-h-screen bg-gray-50" data-unique-id="20bce4f5-0cdc-4b2c-b5c9-c02f30e17c3e" data-loc="14:6-14:47" data-file-name="app/profile/page.tsx">
        <header className="bg-white shadow" data-unique-id="ba71cfa3-afc2-43c5-910c-d66f9e35fb88" data-loc="15:8-15:44" data-file-name="app/profile/page.tsx">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6" data-unique-id="e0939566-851a-450b-ab69-1a6e6bebc7ef" data-loc="16:10-16:63" data-file-name="app/profile/page.tsx">
            <div className="flex items-center justify-between" data-unique-id="57f94d3e-bc0e-44f1-b3bf-04ade459fb28" data-loc="17:12-17:63" data-file-name="app/profile/page.tsx">
              <div className="flex items-center" data-unique-id="fc2224f7-7798-4d47-b5f1-8bfc48fb4401" data-loc="18:14-18:49" data-file-name="app/profile/page.tsx">
                <button onClick={() => router.push("/dashboard")} className="mr-4 p-1 rounded-full hover:bg-gray-100" data-unique-id="54676ef4-a8d8-4f84-b7bf-ecbf17ad9953" data-loc="19:16-19:118" data-file-name="app/profile/page.tsx">
                  <ArrowLeft className="h-5 w-5 text-gray-600" />
                </button>
                <h1 className="text-xl font-bold text-gray-900" data-unique-id="a3f483a6-bc46-4a0f-a033-ea93ff2ff105" data-loc="22:16-22:64" data-file-name="app/profile/page.tsx">My Profile</h1>
              </div>
              <button onClick={signOut} className="flex items-center text-sm font-medium text-red-600 hover:text-red-800" data-unique-id="94864a98-97a9-4d4f-8c8b-2535d1531b41" data-loc="24:14-24:122" data-file-name="app/profile/page.tsx">
                <LogOut className="h-4 w-4 mr-1" /> Sign Out
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 py-8 sm:px-6" data-unique-id="9d5f70d3-e9b6-42da-9fc2-7c64c92398e4" data-loc="31:8-31:62" data-file-name="app/profile/page.tsx">
          <div className="bg-white shadow rounded-lg overflow-hidden" data-unique-id="f99297db-5633-4f85-8073-78ad6b312f46" data-loc="32:10-32:70" data-file-name="app/profile/page.tsx">
            <div className="px-4 py-5 sm:p-6" data-unique-id="80b66bf0-f6ff-4316-8c73-8efbf8338bed" data-loc="33:12-33:46" data-file-name="app/profile/page.tsx">
              <div className="space-y-6" data-unique-id="dd9d4ea5-400e-4a8a-a7fc-0c05219f06f1" data-loc="34:14-34:41" data-file-name="app/profile/page.tsx">
                <div data-unique-id="0888a16c-a457-4816-a883-6cf2e3e2aef7" data-loc="35:16-35:21" data-file-name="app/profile/page.tsx">
                  <h3 className="text-lg font-medium text-gray-900" data-unique-id="b96d5f52-a932-48cd-a806-ae0fc211c3f1" data-loc="36:18-36:68" data-file-name="app/profile/page.tsx">Account Information</h3>
                  <p className="mt-1 text-sm text-gray-500" data-unique-id="b1b492a4-cc1b-4f14-ba2b-92daed8a7097" data-loc="37:18-37:60" data-file-name="app/profile/page.tsx">
                    Your account details and preferences.
                  </p>
                </div>

                <div className="border-t border-gray-200 pt-6" data-unique-id="8857f76c-2a7c-432d-9f33-64405fc1eb9f" data-loc="42:16-42:63" data-file-name="app/profile/page.tsx">
                  <dl className="divide-y divide-gray-200" data-unique-id="0c73bd7e-8d1f-4f6e-847f-0031c61af874" data-loc="43:18-43:59" data-file-name="app/profile/page.tsx">
                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4" data-unique-id="e46d14b1-84a4-4cf5-92f3-c2efdeeddc2d" data-loc="44:20-44:74" data-file-name="app/profile/page.tsx">
                      <dt className="text-sm font-medium text-gray-500" data-unique-id="a8c90f6c-247e-4f49-8a5d-a1aed58ed1ea" data-loc="45:22-45:72" data-file-name="app/profile/page.tsx">User ID</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2" data-unique-id="3331f7a2-9491-4f01-8661-9d785b4158b6" data-loc="46:22-46:87" data-file-name="app/profile/page.tsx">
                        {authState.user?.id}
                      </dd>
                    </div>

                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4" data-unique-id="eb9b95dc-910b-4323-bba1-eb4270760206" data-loc="51:20-51:74" data-file-name="app/profile/page.tsx">
                      <dt className="text-sm font-medium text-gray-500" data-unique-id="4502a766-a70e-482e-b803-fdfee6c358a8" data-loc="52:22-52:72" data-file-name="app/profile/page.tsx">Phone Number</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center" data-unique-id="0268f7f1-c7fa-404e-af9b-5196c839f7fe" data-loc="53:22-53:105" data-file-name="app/profile/page.tsx">
                        <Phone className="h-4 w-4 text-gray-400 mr-2" />
                        {authState.user?.phone}
                      </dd>
                    </div>

                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4" data-unique-id="5dcb855c-f7a3-41dc-911d-c19c314fa37e" data-loc="59:20-59:74" data-file-name="app/profile/page.tsx">
                      <dt className="text-sm font-medium text-gray-500" data-unique-id="76f7f5fc-cec0-4f05-bb95-e7d5059c7bd6" data-loc="60:22-60:72" data-file-name="app/profile/page.tsx">Role</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2" data-unique-id="aa7934d1-7d21-44c5-bee0-8079d1d9bbd1" data-loc="61:22-61:87" data-file-name="app/profile/page.tsx">
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