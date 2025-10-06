import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SupabaseClientService } from './core/services/supabase-client.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'Tasky';
  private sb = inject(SupabaseClientService);

  async ngOnInit() {
    // Test de “readiness” sans table
    const { data, error } = await this.sb.supabase.auth.getSession();
    if (error) {
      console.error('❌ Supabase auth session error', error);
    } else {
      console.log('✅ Supabase client prêt — session:', data.session ? 'présente' : 'absente');
    }
  }
}
