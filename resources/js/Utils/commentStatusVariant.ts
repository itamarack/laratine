type Variant = {
  status?: string;
}

const commentStatusColorMap: { [key: string]: string } = {
  'Approve': 'green',
  'Review': 'yellow',
  'Disapprove': 'red'
};

export default function commentStatusVariant({ status }: Variant) {
  return status ? commentStatusColorMap[status] || 'defaultColor' : 'defaultColor';
}
