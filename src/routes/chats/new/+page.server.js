import {Model} from '$lib/ghmodels.js';

export function load({cookies}) {
    console.log(Model.all().map((m) => ({name: m.name, image: m.image_path()})));
    return {
        models: Model.all().map((m) => ({name: m.name, image: m.image_path()}))
    };
}