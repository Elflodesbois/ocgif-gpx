import { Injectable, WritableSignal, signal } from '@angular/core';

@Injectable({
  	providedIn: 'root',
})
export class NavbarModeSelector {
    
  	public state: WritableSignal<NavbarMode> = signal('login');

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
