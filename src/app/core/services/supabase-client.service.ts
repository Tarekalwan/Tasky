// import { Injectable } from '@angular/core';
// import { createClient, SupabaseClient } from '@supabase/supabase-js';
// import { environment } from '../../../environments/environment';

// @Injectable({ providedIn: 'root' })
// export class SupabaseClientService {
//   public readonly supabase: SupabaseClient;

//   constructor() {
//     this.supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey, {
//       auth: {
//         persistSession: true,
//         autoRefreshToken: true,
//         storage: sessionStorage,     // <- évite les locks inter-onglets
//         storageKey: 'tasky-auth',
//         detectSessionInUrl: false,
//       },
//     });
//   }
// }


import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

// --- Singleton cross-HMR ---
const g = globalThis as unknown as { __taskySupabase?: SupabaseClient };

function getSupabase(): SupabaseClient {
  if (g.__taskySupabase) return g.__taskySupabase;

  const sb = createClient(environment.supabaseUrl, environment.supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      // sessionStorage évite les conflits multi-onglets pendant le dev
      storage: sessionStorage,
      storageKey: 'tasky-auth',
      detectSessionInUrl: false,
    },
  });

  g.__taskySupabase = sb;
  return sb;
}

@Injectable({ providedIn: 'root' })
export class SupabaseClientService {
  public readonly supabase: SupabaseClient = getSupabase();
}
