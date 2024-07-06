type Variant = {
  status?: string;
}

const statusColorMap: { [key: string]: string } = {
  'Publish': 'green',
  'Draft': 'gray',
  'Reviewing': 'yellow',
  'Unpublish': 'red'
};

export default function badgeVariant({ status }: Variant) {
  return status ? statusColorMap[status] || 'defaultColor' : 'defaultColor';
}
