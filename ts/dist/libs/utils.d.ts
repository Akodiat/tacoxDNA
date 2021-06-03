import { Vector3, Matrix3 } from 'three';
declare function randint(low: number, high?: number, size?: number): number | number[];
declare function arraysEqual(a: any[], b: any[]): boolean;
declare function get_angle(a: any, b: any): number;
declare function get_orthonormalized_base(v1: THREE.Vector3, v2: THREE.Vector3, v3: THREE.Vector3): [THREE.Vector3, THREE.Vector3, THREE.Vector3];
declare function get_random_vector_in_sphere(r?: number): Vector3;
declare function get_random_vector(): Vector3;
declare function get_random_rotation_matrix(): Matrix3;
export { randint, arraysEqual, get_angle, get_orthonormalized_base, get_random_vector_in_sphere, get_random_vector, get_random_rotation_matrix };
