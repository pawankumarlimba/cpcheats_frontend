import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import Image from "next/image";

export default function SocialFeed() {
    const posts = [
        {
            id: 1,
            title: "Are we Innocent ?",
            content: "Please add your content here. Keep it short and simple. And smile :) Please add your content here. Keep it short and simple. And smile :)",
            image: "/Blogs/bg.svg",
        },
        {
            id: 2,
            title: "Are we Innocent ?",
            content: "Please add your content here. Keep it short and simple. And smile :) Please add your content here. Keep it short and simple. And smile :)",
            image: "/Blogs/bg.svg",
        },
        {
            id: 3,
            title: "Are we Innocent ?",
            content: "Please add your content here. Keep it short and simple. And smile :) Please add your content here. Keep it short and simple. And smile :)",
            image: "/Blogs/bg.svg",
        },
    ];

    return (
        <div className="container mx-auto p-4 space-y-6">
            <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                    <AvatarImage src="/placeholder.svg" alt="Profile" />
                    <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="flex-1 flex gap-2 items-center">
                    <input
                        placeholder="Share your thoughts"
                        className=" px-4 w-[20%] py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                    />
                    <Button size="icon" className="bg-blue-500 hover:bg-blue-600">
                        <Send className="h-5 w-5 text-white" />
                    </Button>
                </div>
            </div>
            <div className="space-y-4">
                <div className="space-y-2 text-start">
                    <h2 className="text-2xl md:text-4xl font-semibold text-gray-800">You may also experience this</h2>
                    <p className="text-gray-600">
                        Making changes in your life is great and it is the way we grow and develop as people change is a constant.
                    </p>
                </div>
                <div className="flex flex-col lg:flex-row justify-center gap-6">
                    {posts.map((post) => (
                        <div
                            key={post.id}
                            className="flex flex-col md:flex-row shadow-lg rounded-lg overflow-hidden w-full max-w-xl mx-auto"
                        >
                            <div className="p-4 bg-[#F5F5F5] flex flex-col justify-between items-center md:w-1/2">
                                <Avatar className="w-16 h-16 md:w-12 md:h-12">
                                    <AvatarImage src="/placeholder.svg" alt="Profile" />
                                    <AvatarFallback>U</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col items-start gap-2 mb-2 text-center md:text-left">
                                    <h3 className="text-lg text-gray-800 font-semibold">{post.title}</h3>
                                    <p className="text-sm text-gray-600">{post.content}</p>
                                </div>
                                <Button className="mt-2 w-full md:w-auto">Read now</Button>
                            </div>
                            <div className="w-full md:w-1/2">
                                <Image
                                    src={post.image}
                                    alt="Post image"
                                    className="w-full h-48 md:h-72 object-cover"
                                    height={400}
                                    width={250}
                                />
                            </div>
                        </div>
                    ))}

                </div>
            </div>
        </div>
    );
}
