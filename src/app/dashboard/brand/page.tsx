import Link from 'next/link';
import { UserIcon } from '@heroicons/react/24/outline';

<Link
  href="/brand/profile"
  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
>
  <UserIcon className="h-5 w-5" />
  <span>Profile</span>
</Link> 