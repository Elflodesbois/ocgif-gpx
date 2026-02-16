import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import { Auth } from './auth';

@Injectable({
  	providedIn: 'root',
})
export class NavbarModeSelector {

    private loginData = inject(Auth);
    
  	public state: WritableSignal<NavbarMode> = signal(this.loginData.isLoggedIn() ? 'traces' : 'login');

    public changeMode(newMode: NavbarMode) {
        this.state.set(newMode);
		console.log(this.state());
    }
}

export type NavbarMode =
  	| 'traces'
  	| 'login'
  	| 'upload'
  	| 'liste'
    | 'register'
	;
