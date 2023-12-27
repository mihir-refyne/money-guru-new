interface ConstructElementIdContext {
  screenName: string;
  elementName: string;
  elementId?: string;
}

export default function constructElementId(context: ConstructElementIdContext) {
  return [context.screenName, context.elementName, context.elementId]
    .filter(Boolean)
    .join("_");
}
