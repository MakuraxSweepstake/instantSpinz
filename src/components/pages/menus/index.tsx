"use client";

import { useAppDispatch } from "@/hooks/hook";
import { useCreateMenuMutation, useGetAllMenuQuery } from "@/services/menuApi";
import { useGetAllPageQuery } from "@/services/pageApi";
import { showToast, ToastVariant } from "@/slice/toastSlice";
import { Button } from "@mui/material";
import { CloseCircle } from "@wandersonalwes/iconsax-react";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";

export default function MenuPage() {

    const { data, isLoading } = useGetAllPageQuery({ pageIndex: 1, pageSize: 30 });
    const [createMenu, { isLoading: updatingMenu }] = useCreateMenuMutation();
    const { data: menus, isLoading: loadingMenu } = useGetAllMenuQuery();
    const dispatch = useAppDispatch();

    const [selectedMenus, setSelectedMenus] = React.useState<any[]>([]);


    React.useEffect(() => {
        if (menus?.data) {
            setSelectedMenus(menus.data);
        }
    }, [menus?.data]);

    const handleAddMenu = (page: any) => {
        if (selectedMenus.find((item) => item.id === page.id)) return;
        setSelectedMenus((prev) => [...prev, page]);
    };

    const handleRemoveMenu = (id: number) => {
        setSelectedMenus((prev) => prev.filter((item) => item.id !== id));
    };

    const handleMenuSave = async () => {
        try {
            const menuIds = selectedMenus.map((menu) => menu.id);
            const response = await createMenu({ pages: menuIds }).unwrap();

            dispatch(
                showToast({
                    message: "Menu saved successfully!",
                    variant: ToastVariant.SUCCESS,
                })
            );
        } catch (e: any) {
            dispatch(
                showToast({
                    message: e?.data?.message || "Something went wrong, try again later.",
                    variant: ToastVariant.ERROR,
                })
            );
        }
    };

    // Shimmer loader component for MenuPage
    function MenuPageLoading() {
        return (
            <div className="flex flex-col md:grid md:grid-cols-12 gap-8">
                {/* LEFT SIDE - PAGES LIST */}
                <div className="col-span-4 border border-gray-300 rounded-xl p-4">
                    <h2 className="text-lg font-semibold mb-3">All Pages</h2>
                    <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto">
                        {Array.from({ length: 5 }).map((_, idx) => (
                            <div
                                key={idx}
                                className="h-8 bg-gray-200 rounded-lg animate-pulse"
                            ></div>
                        ))}
                    </div>
                </div>

                {/* RIGHT SIDE - SELECTED MENU */}
                <div className="col-span-8 border border-gray-300 rounded-xl p-4">
                    <h2 className="text-lg font-semibold mb-3">Selected Menu</h2>
                    <div className="space-y-3">
                        {Array.from({ length: 3 }).map((_, idx) => (
                            <div
                                key={idx}
                                className="h-10 bg-gray-200 rounded-lg animate-pulse w-full"
                            ></div>
                        ))}
                    </div>
                    <div className="text-end mt-4">
                        <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse  ml-auto"></div>
                    </div>
                </div>
            </div>
        );
    }


    if (isLoading) {
        return <MenuPageLoading />;
    }

    const pages = data?.data?.data || [];

    return (
        <section className=" flex flex-col md:grid md:grid-cols-12 gap-8">
            {/* LEFT SIDE - PAGES LIST */}
            <div className="col-span-4 border border-gray-300 rounded-xl p-4">
                <h2 className="text-lg font-semibold mb-3">All Pages</h2>
                <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto">
                    {pages.map((page: any) => (
                        <button
                            key={page.id}
                            onClick={() => handleAddMenu(page)}
                            className="text-start px-2 py-1 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                        >
                            {page.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* RIGHT SIDE - SELECTED MENU */}
            <div className="col-span-8 border border-gray-300 rounded-xl p-4">
                <h2 className="text-lg font-semibold mb-3">Selected Menu</h2>

                {selectedMenus.length === 0 && (
                    <p className="text-gray-500 text-sm">No menu items added yet.</p>
                )}

                <div className="space-y-3">
                    <AnimatePresence>
                        {selectedMenus.map((menu) => (
                            <motion.div
                                key={menu.id}
                                layout
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="flex items-center justify-between px-4 py-2 border-gray-300 rounded-lg border w-full"
                            >
                                <span className="font-medium text-gray-800">{menu.name}</span>
                                <button
                                    onClick={() => handleRemoveMenu(menu.id)}
                                    className="text-gray-500 hover:text-red-600 transition max-w-fit"
                                >
                                    <CloseCircle size={18} />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {selectedMenus.length > 0 && (
                    <div className="text-end mt-4">
                        <Button
                            variant="contained"
                            color="primary"
                            disabled={updatingMenu}
                            onClick={handleMenuSave}
                        >
                            {updatingMenu ? "Saving..." : "Save Menu"}
                        </Button>
                    </div>
                )}
            </div>
        </section>
    );
}
