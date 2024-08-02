export default function useClientRouting({ prefix = 'admin', routePath, routeId }: RoutingProps): any {
  return {
    list: `${prefix}/${routePath}`,
    create: `${prefix}/${routePath}/create`,
    update: `${prefix}/${routePath}/${routeId}/edit`
  };
}

type RoutingProps = {
  prefix: string;
  routePath: string;
  routeId?: string | number
}
