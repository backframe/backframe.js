import { Children } from 'react';

export function componentType(component) {
  return (props, propName, componentName) => {
    let error;
    const prop = props[propName];

    Children.forEach(prop, (child) => {
      if (child.type.name !== component.name) {
        error = new Error(
          `\`${componentName}\` only accepts children of type \`${component.name}\`.`
        );
      }
    });

    return error;
  };
}
