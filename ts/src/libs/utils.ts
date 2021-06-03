import {FLT_EPSILON} from "./base"
import {Vector3, Matrix3} from 'three'

// Behave like numpy.random.randint
function randint(low: number, high?: number, size=1): number | number[] {
    if (high === undefined) {
        high = low;
        low = 0;
    }
    var a = [];
    for (let i=0;i<size;i++){
        a[i] = low + Math.floor(Math.random()*(high-low));
    };
    if (size === 1) {
        return a[0];
    }
    return a;
}

//From https://stackoverflow.com/a/16436975
function arraysEqual(a: any[], b: any[]) {
    if (a === b) return true;
    if (a === null || b === null) return false;
    if (a.length !== b.length) return false;
  
    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

function get_angle(a, b) {
    /*
    Get angle between a,b

    >>> a =[0, 1, 0];
    >>> b =[0, 0, 1];
    >>> round(get_angle(a,b),3)
    1.571

    */
    let ab = a.dot(b);
    if (ab > (1. - FLT_EPSILON)) { 
        return 0;
    } else if (ab < (-1. + FLT_EPSILON)) { 
        return Math.PI;
    } else { 
        return Math.acos(ab)
    }
}


function get_orthonormalized_base(v1: THREE.Vector3, v2: THREE.Vector3, v3: THREE.Vector3): [THREE.Vector3, THREE.Vector3, THREE.Vector3] {
    v1 = v1.clone();
    v2 = v2.clone();
    v3 = v3.clone();

    const v1_norm2 = v1.dot(v1);
    const v2_v1 = v2.dot(v1);

    v2.sub(v1.clone().multiplyScalar((v2_v1 / v1_norm2)));

    const v3_v1 = v3.dot(v1);
    const v3_v2 = v3.dot(v2);
    const v2_norm2 = v2.dot(v2);

    v3.sub(v1.clone().multiplyScalar((v3_v1 / v1_norm2)).add(v2.clone().multiplyScalar((v3_v2 / v2_norm2))));

    v1.divideScalar(v1_norm2);
    v2.divideScalar(v2_norm2);
    v3.divideScalar(Math.sqrt(v3.dot(v3)));

    return [v1, v2, v3];
}


function get_random_vector_in_sphere(r=1) {
    const r2 = r*r;

    let rnd = ()=>(2*r*Math.random()-r);

    let v = new Vector3(rnd(), rnd(), rnd());
    while (v.dot(v) > r2) {
        v = new Vector3(rnd(), rnd(), rnd());
    }

    return v;
}


function get_random_vector() {
    let ransq = 1.;

    let ran1: number, ran2: number;
    while (ransq >= 1.) {
        ran1 = 1. - 2. * Math.random();
        ran2 = 1. - 2. * Math.random();
        ransq = ran1 * ran1 + ran2 * ran2;
    }

    const ranh = 2. * Math.sqrt(1. - ransq);
    return new Vector3(ran1 * ranh, ran2 * ranh, 1. - 2. * ransq);
}


function get_random_rotation_matrix() {
    let [v1, v2, v3] = get_orthonormalized_base(get_random_vector(), get_random_vector(), get_random_vector());

    let R = new Matrix3().set(
        v1.x, v1.y, v1.z,
        v2.x, v2.y, v2.z,
        v3.x, v3.y, v3.z,
    );
    //  rotations have det === 1
    if (R.determinant() < 0) {
        R = new Matrix3().set(
            v2.x, v2.y, v2.z,
            v1.x, v1.y, v1.z,
            v3.x, v3.y, v3.z
        );
    }

    return R;
}

export {randint, arraysEqual, get_angle, get_orthonormalized_base, get_random_vector_in_sphere, get_random_vector, get_random_rotation_matrix};
