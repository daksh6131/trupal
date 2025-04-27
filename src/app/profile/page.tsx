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
      <div className="min-h-screen bg-gray-50" data-unique-id="1bf5a670-b269-4665-b9d5-d9fbd2fc1020" data-loc="14:6-14:47" data-file-name="app/profile/page.tsx">
        <header className="bg-white shadow" data-unique-id="fb27f64e-9b66-41a2-9aab-f995b575e870" data-loc="15:8-15:44" data-file-name="app/profile/page.tsx">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6" data-unique-id="0f7e8b4c-f262-4c1d-b611-3a8b5017129a" data-loc="16:10-16:63" data-file-name="app/profile/page.tsx">
            <div className="flex items-center justify-between" data-unique-id="dfc98e8e-7584-475a-b3d3-f7d599394874" data-loc="17:12-17:63" data-file-name="app/profile/page.tsx">
              <div className="flex items-center" data-unique-id="5cb2c82d-c6b2-4e0b-ad8f-d93c0997541a" data-loc="18:14-18:49" data-file-name="app/profile/page.tsx">
                <button onClick={() => router.push("/dashboard")} className="mr-4 p-1 rounded-full hover:bg-gray-100" data-unique-id="244488c5-d6f9-4dfc-9007-b2626e107617" data-loc="19:16-19:118" data-file-name="app/profile/page.tsx">
                  <ArrowLeft className="h-5 w-5 text-gray-600" />
                </button>
                <h1 className="text-xl font-bold text-gray-900" data-unique-id="492487f0-e8bb-468c-965a-fe44102b0370" data-loc="22:16-22:64" data-file-name="app/profile/page.tsx">My Profile</h1>
              </div>
              <button onClick={signOut} className="flex items-center text-sm font-medium text-red-600 hover:text-red-800" data-unique-id="0cdfb8a1-70d1-41fa-9419-51f1da2b3384" data-loc="24:14-24:122" data-file-name="app/profile/page.tsx">
                <LogOut className="h-4 w-4 mr-1" /> Sign Out
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 py-8 sm:px-6" data-unique-id="36576431-36a5-4435-93d3-4350c7c34f26" data-loc="31:8-31:62" data-file-name="app/profile/page.tsx">
          <div className="bg-white shadow rounded-lg overflow-hidden" data-unique-id="2b6e543d-61ea-4b5e-9b23-28c352bba428" data-loc="32:10-32:70" data-file-name="app/profile/page.tsx">
            <div className="px-4 py-5 sm:p-6" data-unique-id="815b0cff-80a4-467b-821f-811e82e47ccb" data-loc="33:12-33:46" data-file-name="app/profile/page.tsx">
              <div className="space-y-6" data-unique-id="3505d88e-55f0-4afd-9afc-6e9e6fd5d086" data-loc="34:14-34:41" data-file-name="app/profile/page.tsx">
                <div data-unique-id="65bfd524-21be-4f3e-a7f1-6b71ff49a6d7" data-loc="35:16-35:21" data-file-name="app/profile/page.tsx">
                  <h3 className="text-lg font-medium text-gray-900" data-unique-id="093d3e85-6b66-4455-aa57-8960ae7b2a8c" data-loc="36:18-36:68" data-file-name="app/profile/page.tsx">Account Information</h3>
                  <p className="mt-1 text-sm text-gray-500" data-unique-id="09a9b896-da71-4f2a-b6fe-b0a2b8025f61" data-loc="37:18-37:60" data-file-name="app/profile/page.tsx">
                    Your account details and preferences.
                  </p>
                </div>

                <div className="border-t border-gray-200 pt-6" data-unique-id="451bfa99-049d-44e1-9524-d3d7fe8282a1" data-loc="42:16-42:63" data-file-name="app/profile/page.tsx">
                  <dl className="divide-y divide-gray-200" data-unique-id="f4cb1662-d32a-4af1-80d3-7722519b819b" data-loc="43:18-43:59" data-file-name="app/profile/page.tsx">
                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4" data-unique-id="a684bbcf-1800-4f82-a289-602c01d97708" data-loc="44:20-44:74" data-file-name="app/profile/page.tsx">
                      <dt className="text-sm font-medium text-gray-500" data-unique-id="1eb94f12-8619-45a2-8637-e2b84350d876" data-loc="45:22-45:72" data-file-name="app/profile/page.tsx">User ID</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2" data-unique-id="ef453e85-adcb-4b50-bc70-fe5a362faa1c" data-loc="46:22-46:87" data-file-name="app/profile/page.tsx">
                        {authState.user?.id}
                      </dd>
                    </div>

                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4" data-unique-id="3f61104d-51e4-447b-8a7b-4b8e4361fead" data-loc="51:20-51:74" data-file-name="app/profile/page.tsx">
                      <dt className="text-sm font-medium text-gray-500" data-unique-id="458d95a5-ea34-48bb-bc55-7674c26d2315" data-loc="52:22-52:72" data-file-name="app/profile/page.tsx">Phone Number</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center" data-unique-id="c102d278-716e-4e94-9f82-4a4b67fc7357" data-loc="53:22-53:105" data-file-name="app/profile/page.tsx">
                        <Phone className="h-4 w-4 text-gray-400 mr-2" />
                        {authState.user?.phone}
                      </dd>
                    </div>

                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4" data-unique-id="11c9bae1-f54d-45e9-9168-0bc391841be4" data-loc="59:20-59:74" data-file-name="app/profile/page.tsx">
                      <dt className="text-sm font-medium text-gray-500" data-unique-id="c121adda-7dc1-4873-a391-7db23dfb6f14" data-loc="60:22-60:72" data-file-name="app/profile/page.tsx">Role</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2" data-unique-id="7a5abce9-bbcf-4e02-a166-0068a4b548c4" data-loc="61:22-61:87" data-file-name="app/profile/page.tsx">
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