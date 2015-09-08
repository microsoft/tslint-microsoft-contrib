
module SetTimeoutSample {
    'use strict';

    class MyClass {

        private onAnimationEnd(): void {
        }

        private method(): void {
            setTimeout(this.onAnimationEnd(), 300);
        }

    }
}
